import {Pipe, PipeTransform} from '@angular/core';
import {U} from "../starter/utils/utils";


@Pipe({
  name: 'currentTasker'
})
export class CurrentTaskerPipe implements PipeTransform {
  transform(value: any, status: any): any {
    if (U.StringUtils.isBank(value)) {
      return "";
    }
    console.log(value)
    const flows: any[] = JSON.parse(value);

    let f: any = {};
    flows.forEach((x) => {
      if (x.status == status) {
        f = x;
      }
    })
    return f.creator || "";
  }

}
