import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { SERIES } from './constants';

const mapNurseToDateOption = ({ date }) => ({
  value: date,
  label: moment(date).format('MMMM Do'),
});

@Component({
  selector: 'chart-filters',
  templateUrl: './chart-filters.component.html',
  styleUrls: ['./chart-filters.component.scss']
})
export class ChartFilters {
  public options = [];
  public series = Object.keys(SERIES).map(key => ({ key, label: SERIES[key] }));

  @Input() startDate;
  @Input() selectedSeries;
  @Output() selectDate: EventEmitter<Date>;
  @Output() selectSeries: EventEmitter<string>;

  constructor() {
    this.selectDate = new EventEmitter<Date>();
    this.selectSeries = new EventEmitter<string>();
  }

  @Input()
  set nursingRecords(nursingRecords) {
    this.options = (nursingRecords || []).map(mapNurseToDateOption);
  }

  onChange(event) {
    const date = event.detail.value;

    if (date !== this.startDate) {
      this.selectDate.emit(date);
    }
  }

  onSelectSeries(series) {
    if (series !== this.selectedSeries) {
      this.selectSeries.emit(series);
    }
  }
}
