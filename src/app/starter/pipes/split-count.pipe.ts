import { Pipe, PipeTransform } from '@angular/core';
import {U} from "../utils/utils";


@Pipe({
  name: 'splitCount'
})
export class SplitCountPipe implements PipeTransform {

  transform(value: string): number {
    if (U.StringUtils.isBank(value)) {
      return 0
    }

    return value.split(",").length;
  }

}
