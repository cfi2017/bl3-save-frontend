import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(array: string[], filter: string): string[] {
    return array.filter(a => a.includes(filter));
  }

}
