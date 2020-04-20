import { Pipe, PipeTransform } from '@angular/core';
import { AssetService } from './asset.service';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  constructor(
    private assets: AssetService
  ) {}


  transform(value: string): unknown {
    const v = value.split('.');
    return this.assets.getName(v[v.length - 1]);
  }

}
