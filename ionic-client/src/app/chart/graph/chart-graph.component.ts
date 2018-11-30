import { Component, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { buildGraph } from './build-graph';

@Component({
  selector: 'chart-graph',
  templateUrl: './chart-graph.component.html',
  styleUrls: ['./chart-graph.component.scss']
})
export class ChartGraph implements OnChanges {
  @ViewChild('graph') graphCanvas;
  @Input() nursingRecords;
  @Input() series: string;

  lineChart: any;

  constructor() {}

  ionViewDidLoad() {
    this.redraw();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.shouldRedraw(changes)) {
      this.redraw();
    }
  }

  shouldRedraw = ({ nursingRecords, series }: SimpleChanges) => (
    didNursingRecordsChange(nursingRecords) ||
      series && series.previousValue !== series.currentValue
  )

  redraw = () => {
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    this.lineChart = new Chart(
      this.graphCanvas.nativeElement,
      buildGraph(this.nursingRecords, this.series),
    );
  }
}

const didNursingRecordsChange = (nr?: SimpleChange) => {
  if (!nr) {
    return false;
  }

  const previousLength = nr.previousValue ? nr.previousValue.length : 0;
  const currentLength = nr.currentValue ? nr.currentValue.length : 0;

  return previousLength !== currentLength;
};
