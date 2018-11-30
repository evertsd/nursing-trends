import { Component, OnInit } from '@angular/core';
import { MockDataProvider } from 'src/app/providers/mock-data';
import { SERIES } from './filters/constants';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class Chart implements OnInit {
  public startDate = undefined;
  public selectedSeries = SERIES.PRODUCED;
  public nursingRecords = [];

  constructor(public mockDataService: MockDataProvider) {
  }

  ngOnInit() {
    this.updateNursingRecords();
  }

  onDateSelected = (startDate) => {
    if (startDate === this.startDate) {
      return;
    }

    this.startDate = startDate;
    this.updateNursingRecords();
  }

  onSelectSeries = (series) => {
    this.selectedSeries = series;
  }

  private updateNursingRecords = () => (
    this.mockDataService.getNursingRecords({ startDate: this.startDate })
      .then(nursingRecords => this.nursingRecords = nursingRecords)
  )
}
