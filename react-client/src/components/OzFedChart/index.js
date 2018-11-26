import React from 'react';
import { LineChart } from 'react-chartkick';
import { compose, withStateHandlers } from 'recompose';
import ChartFilter, { SERIES } from './ChartFilters';
import { Colors } from '../library';
import { fetchNursingRecords, averageMinutesNursing } from '../../backend';

const estimatedNursingProduction = (point, ave) => {
  if (!(point && point.nurse) || ave === 0) {
    return 0;
  }

  return (1.5 / ave) * point.nurse.minutes;
};

const calculateLinearTrendline = ({ data }, name) => {
  if (data.length <= 1) {
    return { name, data };
  }

  const b = data[0][1];
  const m = data.reduce((sum, point, index) => {
    if (index === 0) {
      return 0;
    }

    return sum + (point[1] - data[index - 1][1]);
  }, 0) / (data.length - 1);

  return {
    name,
    data: data.map((point, index) => [point[0], index * m + b]),
  };
}

const individualProduced = (data, ave) => {
  const pumped = { name: 'Amount pumped', data: [] };
  const nursed = { name: 'Amount nursed', data: [] };
  const total = { name: 'Amount produced', data: [] };

  data.forEach((d) => {
    const p = d.pumped.produced;
    const n = estimatedNursingProduction(d, ave);

    pumped.data.push([d.date, +Number(p).toFixed(2)]);
    nursed.data.push([d.date, +Number(n).toFixed(2)]);
    total.data.push([d.date, +Number(p + n).toFixed(2)]);
  });

  return [total, nursed, pumped, calculateLinearTrendline(total)];
};

const individualConsumed = (data, ave) => {
  const pumped = { name: 'Amount pumped', data: [] };
  const nursed = { name: 'Amount nursed', data: [] };
  const formula = { name: 'Formula consumed', data: [] };
  const total = { name: 'Amount produced', data: [] };

  data.forEach((d) => {
    const p = d.pumped.consumed;
    const n = estimatedNursingProduction(d, ave);
    const f = isNaN(Number(d.formula)) ? 0 : d.formula;

    pumped.data.push([d.date, +Number(p).toFixed(2)]);
    nursed.data.push([d.date, +Number(n).toFixed(2)]);
    formula.data.push([d.date, +Number(f).toFixed(2)])
    total.data.push([d.date, +Number(p + n + f).toFixed(2)]);
  });

  return [
    total, nursed, pumped, formula,
    calculateLinearTrendline(total, 'Trendline (total)'),
    calculateLinearTrendline(formula, 'Trendline (formula)'),
  ];
};

const ChartKickDemo = ({ data, title }) => (
  <LineChart
    data={data}
    title={title}
    legend={true}
    xtitle="Date"
    ytitle="oz"
    trendlines={{ 0: { lineWidth: 2, color: 'black' } }}
    options={{ trendlines: { 0: { lineWidth: 2, color: 'black' } }}}
  />
);

const DailyTotalChart = (props) => {
  const data = props.nursingRecords;

  return (
    <div className="pa4 flex">
      <div
        className="ba bw2 ph3 pb3 pt1"
        style={{
          flex: '2 1 0',
          borderColor: Colors.Grey.Lightest,
          backgroundColor: Colors.Grey.White,
        }}>
        {props.series === SERIES.PRODUCED ? (
          <ChartKickDemo
            data={individualProduced(data, averageMinutesNursing(data))}
            title="Amount produced"
          />
        ) : (
          <ChartKickDemo
            data={individualConsumed(data, averageMinutesNursing(data))}
            title="Amount consumed"
          />
        )}
      </div>
      <ChartFilter {...props} />
    </div>
  );
};

const withNursingRecords = (WrappedComponent) => (
  class FetchNursingRecords extends React.Component {
    constructor(props) {
      super(props);

      this.state = { nursingRecords: [] };
    }

    fetchRecords = () => {
      const startDate = this.props.startDate ? this.props.startDate.value : undefined;

      fetchNursingRecords({ startDate })
        .then(nursingRecords => this.setState({ nursingRecords }));
    }

    componentDidMount() {
      this.fetchRecords();
    }

    filtersChanged = (prevProps) => {
      const oldStartDate = prevProps.startDate || {};
      const newStartDate = this.props.startDate || {};

      return oldStartDate.value !== newStartDate.value;
    }

    componentDidUpdate(prevProps) {
      if (this.filtersChanged(prevProps)) {
        this.fetchRecords();
      }
    }

    render = () => (
      <WrappedComponent {...this.props} nursingRecords={this.state.nursingRecords} />
    );
  }
);

const initialFilters = {
  series: SERIES.CONSUMED,
  startDate: undefined,
};

const withChartFilters = withStateHandlers(initialFilters, {
  setSeries: state => series => ({ ...state, series }),
  setStartDate: state => startDate => ({ ...state, startDate }),
});

export default compose(
  withChartFilters,
  withNursingRecords,
)(DailyTotalChart);
