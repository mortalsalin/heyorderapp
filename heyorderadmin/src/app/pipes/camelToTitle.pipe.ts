import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'camelToTitle'})
export class CamelToTitlePipe implements PipeTransform {
  transform(value) : any {
    return value
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str){ return str.toUpperCase(); })
  }
}