import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asset'
})
export class AssetPipe implements PipeTransform {

  transform(value: string, separator = '/'): string {
    const v = value.split(separator);
    return v[v.length - 1];
  }

}
