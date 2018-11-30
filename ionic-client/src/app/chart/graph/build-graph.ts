import { TimeUnit } from 'chart.js';
import { SERIES } from '../filters/constants';

const Colors = {
  Blue: '#4646CA',
  Red: '#CA4646',
  Green: '#46CA46',
  Yellow: '#46CACA',
  Purple: '#CA46CA',
};

const buildProducedSeries = (data, ave) => {
  const pumped = { label: 'Amount pumped', data: [], backgroundColor: Colors.Blue  };
  const nursed = { label: 'Amount nursed', data: [], backgroundColor: Colors.Red };
  const total = { label: 'Amount produced', data: [], backgroundColor: Colors.Green  };

  data.forEach((d) => {
    const p = d.pumped.produced;
    const n = estimatedNursingProduction(d, ave);

    pumped.data.push({ x: d.date, y: +Number(p).toFixed(2) });
    nursed.data.push({ x: d.date, y: +Number(n).toFixed(2) });
    total.data.push({ x: d.date, y: +Number(p + n).toFixed(2) });
  });

  return [
    total, nursed, pumped,
    calculateLinearTrendline(total, 'Trendline (total)'),
  ];
};

const buildConsumedSeries = (data, ave) => {
  const pumped = { label: 'Amount pumped', data: [], backgroundColor: Colors.Blue };
  const nursed = { label: 'Amount nursed', data: [], backgroundColor: Colors.Red };
  const formula = { label: 'Formula consumed', data: [], backgroundColor: Colors.Purple };
  const total = { label: 'Amount produced', data: [], backgroundColor: Colors.Green };

  data.forEach((d) => {
    const p = d.pumped.consumed;
    const n = estimatedNursingProduction(d, ave);
    const f = isNaN(Number(d.formula)) ? 0 : d.formula;

    pumped.data.push({ x: d.date, y: +Number(p).toFixed(2) });
    nursed.data.push({ x: d.date, y: +Number(n).toFixed(2) });
    formula.data.push({ x: d.date, y: +Number(f).toFixed(2) });
    total.data.push({ x: d.date, y: +Number(p + n + f).toFixed(2) });
  });

  return [
    total, nursed, pumped, formula,
    calculateLinearTrendline(total, 'Trendline (total)'),
  ];
};

const createXAxes = () => {
  const unit: TimeUnit = 'day';

  return { type: 'time', time: { unit } };
};

export const buildGraph = (data, seriesType) => {
  const ave = averageMinutesNursing(data);
  const datasets = (seriesType === SERIES.PRODUCED ?
    buildProducedSeries(data, ave) :
    buildConsumedSeries(data, ave)
  ).map(d => ({ ...d, fill: false }));

  return {
    type: 'line',
    data: { datasets },
    labels: datasets.map(({ label }) => label),
    options: {
      scales: {
        yAxes: [{ type: 'linear', position: 'bottom' }],
        xAxes: [createXAxes()],
      },
    },
  };
};

const averageMinutesNursing = (totals = []) => {
  const sum = totals.reduce((s, t) => ({
    times: s.times + t.nurse.times,
    minutes: s.minutes + t.nurse.minutes
  }), { times: 0, minutes: 0 });

  if (sum.times === 0) {
    return 0;
  }

  return sum.minutes / sum.times;
};


const calculateLinearTrendline = ({ data }, label) => {
  const backgroundColor = Colors.Yellow;

  if (data.length <= 1) {
    return { label, data, backgroundColor };
  }

  const b = data[0].y;
  const m = data.reduce((sum, point, index) => {
    if (index === 0) {
      return 0;
    }

    return sum + (point.y - data[index - 1].y);
  }, 0) / (data.length - 1);

  return {
    backgroundColor,
    label,
    data: data.map((point, index) => ({ x: point.x, y: index * m + b })),
  };
};

const estimatedNursingProduction = (point, ave) => {
  if (!(point && point.nurse) || ave === 0) {
    return 0;
  }

  return (1.5 / ave) * point.nurse.minutes;
};
