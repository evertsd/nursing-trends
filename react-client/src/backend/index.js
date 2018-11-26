import { fetchNursingRecords } from './mock';

export { fetchNursingRecords };

export const averageMinutesNursing = (totals = []) => {
  let sum = totals.reduce((s, t) => ({
    times: s.times + t.nurse.times,
    minutes: s.minutes + t.nurse.minutes
  }), { times: 0, minutes: 0 });

  if (sum.times === 0) {
    return 0;
  }

  return sum.minutes / sum.times;
}
