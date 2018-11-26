import moment from 'moment';
import React from 'react';
import Select from 'react-select';
import { Button, Colors } from '../library';

export const SERIES = {
  PRODUCED: 'Produced',
  CONSUMED: 'Consumed',
};

const SeriesSelect = ({ series, setSeries, style }) => (
  <div style={style}>
    Type
    <div className="btn-group flex mt2">
      {Object.keys(SERIES).map((key) => (
        <Button
          key={key}
          style={{ flexGrow: 1 }}
          onClick={() => setSeries(SERIES[key])}
          selected={series === SERIES[key]}>
          {SERIES[key]}
        </Button>
      ))}
    </div>
  </div>
);

const mapNurseToDateOption = ({ date }) => ({
  value: date,
  label: moment(date).format('MMMM Do'),
});

const withDateOptions = (WrappedComponent) => (
  class MapNursingRecordsToOptions extends React.Component {
    constructor(props) {
      super(props);

      this.state = { options: [] };
    }

    componentDidUpdate(prevProps) {
      const { nursingRecords } = this.props;
      const { options } = this.state;

      if (nursingRecords.length > options.length) {
        this.setState({ options: nursingRecords.map(mapNurseToDateOption) });
      }
    }

    render = () => (
      <WrappedComponent {...this.props} options={this.state.options} />
    )
  }
)


const SelectStartDate = withDateOptions(({ options, startDate, setStartDate, className, style }) => (
  <div className={className} style={style}>
    Start date
    <div className="mt2">
      <Select value={startDate} onChange={setStartDate} options={options} />
    </div>
  </div>
));

const ChartFilter = (props) => (
  <div
    className="ba bw2 ph4 pt0 pb3 ml5"
    style={{
      flex: '1 1 0',
      borderColor: Colors.Grey.Lightest,
      backgroundColor: Colors.Grey.White,
    }}>
    <h2>Graph Options</h2>
    <SeriesSelect {...props} style={{ flexGrow: 1 }} />
    <SelectStartDate {...props} className="mt3" />
  </div>
);

export default ChartFilter;
