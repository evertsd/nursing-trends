import moment from 'moment';
import data from './data';

export const fetchNursingRecords = ({ startDate }) => {
  let nursingRecords = data;

  if (startDate) {
    nursingRecords = nursingRecords.filter(({ date }) => {
      console.info('startDate, date', startDate, date);
      const diff = moment(startDate).diff(date, 'days');
      console.info('fetchNursingRecords, diff', diff);
      return diff < 1;
    });
  }

  console.info('nursingRecords', nursingRecords);

  return Promise.resolve(nursingRecords);
}
