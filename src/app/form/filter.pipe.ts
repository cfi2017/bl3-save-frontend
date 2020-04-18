import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(array: string[], filter: string): string[] {
    const lcf = filter.toLowerCase();
    return array.filter(a => a.toLowerCase().includes(lcf));
  }

}
