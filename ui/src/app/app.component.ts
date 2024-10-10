import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import www_leaffilter_com from '../assets/output/cloudflare--www-leaffilter-com-2024-09-10--2024-10-10.json';
import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NgForOf,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  week = ['TIME', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  indexes = ['0', '1', '2', '3', '4', '5', '6'];

  selected: string = 'www_leaffilter_com';
  data: { [type: string]: { title: string; }; } = {
    www_leaffilter_com: {
      title: 'www.leaffilter.com',
    }
  }
  datum: Array<{
    '0': number;
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
    '6': number;
  }> = www_leaffilter_com;

  metricLimit: string = '50000';

  getTime = (index: number): string => {
    if (index === 0) return 'Midnight';
    if (index === 12) return 'Noon';
    const hours = index <= 12 && index !== 0
      ? index.toString().padStart(2, '0')
      : (index - 12).toString().padStart(2, '0');
    const adnum = index <= 12 && index !== 0 ? 'am' : 'pm';
    const time = `${hours}:00 ${adnum}`;
    return time;
  };

  getMetric = (index: number, day: string): number => {
    return (this.datum[index] as any)[day];
  };

  isMetricOver = (index: number, day: string): boolean => {
    const metricCheck: number = + this.metricLimit;
    return (this.datum[index] as any)[day] > metricCheck;
  };
  isMetricRowOver = (index: number): boolean => {
    const metricCheck: number = + this.metricLimit;
    let isRowOver: boolean = false;
    for (let i = 0, len = this.indexes.length; i < len; i++) {
      if ((this.datum[index] as any)[this.indexes[i]] > metricCheck) {
        isRowOver = true;
        break;
      }
    }
    return isRowOver;
  };

  columnHover: string = '';
  columnMouseOver = (day: string): void => {
    this.columnHover = day;
  };
  columnMouseOut = (): void => {
    this.columnHover = '';
  };
  isColumnOver = (day: string): boolean => {
    const dayText: string = this.week[+day + 1];
    return dayText === this.columnHover;
  };
}
