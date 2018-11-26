import moment from 'moment';
import data from './data';

const filterBeforeDate = startDate => ({ date }) => (
  moment(startDate).diff(date, 'days') < 1
);

export const fetchNursingRecords = ({ startDate }) => {
  let nursingRecords = data;

  if (startDate) {
    nursingRecords = nursingRecords.filter(filterBeforeDate(startDate));
  }

  return Promise.resolve(nursingRecords);
}
