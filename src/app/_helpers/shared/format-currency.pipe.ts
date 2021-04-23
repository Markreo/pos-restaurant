import {Pipe, PipeTransform} from '@angular/core';
import {formatNumber} from '../functions';

@Pipe({
  name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {

  transform(value: number, vnd = true): any {
    if (isNaN(value)) {
      value = 0;
    }
    if (vnd) {
      return formatNumber(Math.round(value * 100) / 100);
    } else {
      return '$ ' + formatNumber(value / 100) + ',00';
    }
  }

}
