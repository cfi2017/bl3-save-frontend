import { Pipe, PipeTransform } from '@angular/core';
import { Item } from './model';

@Pipe({
  name: 'filterItems'
})
export class FilterItemsPipe implements PipeTransform {

  transform(items: Item[], filters: string[], deep: boolean = false): unknown {
    if (!items || !filters) {
      return items;
    }
    filters = filters.map(filter => filter.toLowerCase());
    return items.filter(item => {
      let value = this.checkValue(item.balance, filters)
        || this.checkValue(item.inv_data, filters)
        || this.checkValue(item.manufacturer, filters)
        || this.checkValue(item.level, filters);
      if (deep) {
        value = value || this.checkValue(item.generics, filters)
        || this.checkValue(item.parts, filters);
      }
      return value;
    });
  }

  checkValue(val: string|string[]|number, filters: string[]): boolean {
    if (typeof val === 'string') return filters.some(filter => val.toLowerCase().includes(filter));
    if (typeof val === 'number') return filters.some(filter => ('' + val).toLowerCase().includes(filter));
    return val.some(value => filters.some(filter => value.toLowerCase().includes(filter)));
  }

}
