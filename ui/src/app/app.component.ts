import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import www_leaffilter_ca from '../assets/output/www-leaffilter-ca--summary.json';
import www_leaffilter_com from '../assets/output/www-leaffilter-com--summary.json';
import www_leafhome_com from '../assets/output/www-leafhome-com--summary.json';
import www_leafhomesafetysolutions_com from '../assets/output/www-leafhomesafetysolutions-com--summary.json';
import www_leafhomewatersolutions_com from '../assets/output/www-leafhomewatersolutions-com--summary.json';


interface Datum {
  [key: string]: {
    metric: number;
    count: number;
  };
};

interface DatumType {
  title: string;
  import: any;
  metricLimit: string;
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

  selected: string = 'www_leaffilter_ca';
  dataList: Array<string> = [
    'www_leaffilter_ca',
    'www_leaffilter_com',
    'www_leafhome_com',
    'www_leafhomesafetysolutions_com',
    'www_leafhomewatersolutions_com',
  ];
  data: { [key: string]: DatumType } = {
    www_leaffilter_ca: {
      title: 'www.leaffilter.ca',
      import: www_leaffilter_ca,
      metricLimit: '1200',
    },
    www_leaffilter_com: {
      title: 'www.leaffilter.com',
      import: www_leaffilter_com,
      metricLimit: '50000',
    },
    www_leafhome_com: {
      title: 'www.leafhome.com',
      import: www_leafhome_com,
      metricLimit: '15000',
    },
    www_leafhomesafetysolutions_com: {
      title: 'www.leafhomesafetysolutions.com',
      import: www_leafhomesafetysolutions_com,
      metricLimit: '2200',
    },
    www_leafhomewatersolutions_com: {
      title: 'www.leafhomewatersolutions.com',
      import: www_leafhomewatersolutions_com,
      metricLimit: '15000',
    }
  }
  datum: Array<Datum> = this.getSum(www_leafhomewatersolutions_com);

  metricLimit: string = '15000';

  changeDataset = (set: string): void => {
    this.getSum(this.data[this.selected].import);
  };

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
    const data: { metric: number, count: number } = (this.datum[index] as any)[day];
    const average = Math.round(data.metric / data.count);
    return average;
  };

  isMetricOver = (index: number, day: string): boolean => {
    const metricCheck: number = + this.metricLimit;
    const point: { metric: number, count: number } = (this.datum[index] as any)[day];
    const check: number = Math.round(point.metric / point.count);
  return check > metricCheck;
  };
  isMetricRowOver = (index: number): boolean => {
    const metricCheck: number = + this.metricLimit;
    let isRowOver: boolean = false;
    for (let i = 0, len = this.indexes.length; i < len; i++) {
      const point: { metric: number, count: number } = (this.datum[index] as any)[this.indexes[i]];
      const check: number = Math.round(point.metric / point.count);
      if (check > metricCheck) {
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

  getKeys(item: { [key: string]: /*Array<Datum>*/ any }): Array<string> {
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
          for (let i = 0, len = 6; i < len; i++) {
            const i_string: string = i.toString();
            result[index][i_string] = {
              metric: result[index][i_string].metric + subset[i_string].metric,
              count: result[index][i_string].count + subset[i_string].count
            };
          }
        }
      });
    });

    console.log(result);
    return result;
  };
}
