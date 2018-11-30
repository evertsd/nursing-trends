import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { Navbar } from '../navbar/navbar.component';
import { Chart } from '../chart/chart.component';
import { ChartDateFilter } from '../chart/date-filter/chart-date-filter.component';
import { ChartFilters } from '../chart/filters/chart-filters.component';
import { ChartGraph } from '../chart/graph/chart-graph.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, Navbar, Chart, ChartFilters, ChartGraph, ChartDateFilter]
})
export class HomePageModule {}
