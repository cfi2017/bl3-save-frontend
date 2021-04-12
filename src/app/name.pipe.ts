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
    return this.assets.getName(value.split('.')[0]);
  }

}
