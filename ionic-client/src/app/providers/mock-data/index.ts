import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { data } from './data';

const filterBeforeDate = startDate => ({ date }) => (
  moment(startDate).diff(date, 'days') < 1
);

@Injectable()
export class MockDataProvider {
  constructor() {

  }

  getNursingRecords = ({ startDate }) => {
    let nursingRecords = data;

    if (startDate) {
      nursingRecords = nursingRecords.filter(filterBeforeDate(startDate));
    }

    return Promise.resolve(nursingRecords);
  }
}
