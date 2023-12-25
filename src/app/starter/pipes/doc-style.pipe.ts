import {Pipe, PipeTransform} from '@angular/core';
import {DocStyle} from "../utils/doc-style";


@Pipe({
  name: 'docStyle'
})
export class DocStylePipe implements PipeTransform {

  transform(value: any): string {
    return DocStyle.autoConvert(value)
  }
}
