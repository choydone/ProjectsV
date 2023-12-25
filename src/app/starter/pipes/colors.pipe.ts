import {Pipe, PipeTransform} from '@angular/core';
import {Colors} from "../../constants/colors";
import {U} from "../utils/utils";


@Pipe({
  name: 'colors'
})
export class ColorsPipe implements PipeTransform {
  transform(value: any, colorKey: string): any {
    let color: any = "purple";

    let colors: any[] = Colors[colorKey];
    if (U.CollectionUtils.isEmpty(colors)) {
      return color;
    }

    colors.forEach((c) => {
      if (c.value == value) {
        color = c.color;
      }
    })
    return color;
  }


}
