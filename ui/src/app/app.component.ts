import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import www_leaffilter_com from '../assets/output/www-leaffilter-com.json';
import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Datum {
  '0': number;
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  '6': number;
};

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
  data: { [type: string]: { title: string; import: any; }; } = {
    www_leaffilter_com: {
      title: 'www.leaffilter.com',
      import: www_leaffilter_com,
    }
  }
  datum: Array<Datum> = this.getSum(www_leaffilter_com);

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

  getKeys(item: { [key: string]: Array<Datum> }): Array<string> {
    const keys = ['SUMMARY', ...Object.keys(item)];
    return keys;
  }
  getSum(item: { [key: string]: Array<Datum> }): Array<Datum> {
    const keys = Object.keys(item);
    const result: Array<Datum> = [];

    keys.forEach((key: string) => {
      const data: Array<Datum> = item[key];
      data.forEach((subset: Datum, index: number) => {
        if (result[index] === undefined) {
          result[index] = subset;
        } else {
          result[index]['0'] = result[index]['0'] + subset['0'];
          result[index]['1'] = result[index]['1'] + subset['1'];
          result[index]['2'] = result[index]['2'] + subset['2'];
          result[index]['3'] = result[index]['3'] + subset['3'];
          result[index]['4'] = result[index]['4'] + subset['4'];
          result[index]['5'] = result[index]['5'] + subset['5'];
          result[index]['6'] = result[index]['6'] + subset['6'];
        }
      });
    });

    return result;
  };
}
