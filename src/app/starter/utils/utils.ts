import {format, parse} from "date-fns";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {HttpHeaders, HttpParams} from "@angular/common/http";
// import {Message} from "../model/result";

export class U {
  static ObjectUtils = {
    isNull: (obj: any): boolean => {
      return typeof obj === 'undefined' || obj === null || obj === 'undefined' || obj === 'null' || obj === undefined;
    },
    nonNull: (obj: any): boolean => {
      return !U.ObjectUtils.isNull(obj);
    },

  }

  static StringUtils = {
    isBank: (obj: string): boolean => {
      return U.StringUtils.isNull(obj) || obj === '';
    },

    isNotBank: (obj: any): boolean => {
      return !U.StringUtils.isBank(obj);
    },
    isNull: (obj: any): boolean => {
      return typeof obj === 'undefined' || obj === null || obj === 'undefined' || obj === 'null' || obj === undefined;
    },

    nonNull: (obj: any): boolean => {
      return !U.StringUtils.isNull(obj);
    }
  }

  static NumberUtils = {
    isNull: (obj: any): boolean => {
      return typeof obj === 'undefined' || obj === null || obj === 'undefined' || obj === 'null' || obj === undefined || obj === '';
    },

    nonNull: (obj: any): boolean => {
      return !U.NumberUtils.isNull(obj);
    }
  }

  static CollectionUtils = {
    isNotEmpty: (obj: any): boolean => {
      return obj !== null && obj !== undefined && obj.length > 0;
    },

    isEmpty: (obj: any): boolean => {
      return !U.CollectionUtils.isNotEmpty(obj);
    }
  }

  static DateUtils = {

    format: (date: any, fmt: any): any => {
      let o: any = {
        'M+': date.getMonth() + 1,                 // 月份
        'd+': date.getDate(),                    // 日
        'h+': date.getHours(),                   // 小时
        'm+': date.getMinutes(),                 // 分
        's+': date.getSeconds(),                 // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds()             // 毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
      return fmt;
    },
    masks: {
      default: 'yyyy-MM-dd hh:mm:ss',
      day: 'yyyy-MM-dd',
      month: 'MM',
      year_month: 'yyyy-MM',
      month_chinese: 'yyyy年M月',
      year: 'yyyy',
      shortDate: 'm/d/yy',
      mediumDate: 'mmm d, yyyy',
      longDate: 'mmmm d, yyyy',
      fullDate: 'dddd, mmmm d, yyyy',
      shortTime: 'h:MM TT',
      mediumTime: 'h:MM:ss TT',
      longTime: 'h:MM:ss TT Z',
      isoDate: 'yyyy-mm-dd',
      isoTime: 'HH:MM:ss',
      isoDateTime: 'yyyy-mm-dd\'T\'HH:MM:sso',
      isoUtcDateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
      expiresHeaderFormat: 'ddd, dd mmm yyyy HH:MM:ss Z'
    }

  }

  /**
   * 获取最后分割符的后续的字符串
   * @param input 需要取值的字符串
   * @param dot 默认分割符: "."
   */
  static getValueAfterLastDot(input: string, dot: string = '.'): string {
    const lastIndex = input.lastIndexOf(dot);
    if (lastIndex !== -1 && lastIndex < input.length - 1) {
      return input.substring(lastIndex + 1);
    } else {
      return '';
    }
  }

  /**
   * 字符串对比，不区分大小写
   * @param source
   * @param target
   */
  static compareStringsIgnoreCaseAndTrim(source: string, target: string): boolean {
    return source.trim().toLowerCase() === target.trim().toLowerCase();
  }

  /**
   * 字符串是否包含在数组内，不区分大小写
   * @param target
   * @param array
   */
  static isStringInArrayIgnoreCaseAndTrim(target: string, array: string[]): boolean {
    const cleanedArray = array.map(item => item.trim().toLowerCase());
    const cleanedTarget = target.trim().toLowerCase();
    return cleanedArray.includes(cleanedTarget);
  }


}

export class R {
  /**
   * 是否成功
   */
  success!: boolean;

  /**
   * 返回数据标志
   */
  code!: string;
  /**
   * 文本说明
   */
  message!: any;
  /**
   * 数据对象
   */
  t!: any;


  static isSuccess(obj: any): boolean {
    return obj.code === R.RESULT_STATUS.SUCCESS;
  }

  static RESULT_STATUS = {
    SUCCESS: "200",
    SESSION_EXPIRY: "A0400",
    UNAUTHENTICATED: "A0401",
    PARAMETER_ERROR: "S0530"
  };


}


export class P {

  /**
   * 对数据进行预先处理
   */
  static preText(text: any): any {
    return U.StringUtils.isBank(text) ? '' : text;
  }


  /**
   * 对数据进行预先处理
   */
  static preBoolean(text: any, _true: any, _false: any): any {
    return text ? _true : _false;
  }

  /**
   * 对数组进行逗号分割
   * @param arr
   */
  static preArray(arr: any): any {
    let a = U.ObjectUtils.isNull(arr) ? [] : arr;
    return a.join(",");
  }

  /**
   * 对数组进行逗号分割
   * @param text
   */
  static afterArray(text: string): any {
    if (U.StringUtils.isBank(text)) {
      return null;
    }
    return text.split(',');
  }

  /**
   * 对数组进行逗号分割
   * @param text
   */
  static afterNumberArray(text: string): any {
    if (U.StringUtils.isBank(text)) {
      return null;
    }
    let idsStr = text.split(',');
    let ids: any[] = [];
    idsStr.forEach((id) => {
      ids = [...ids, Number(id)];
    })
    return ids;
  }

  /**
   *  日期转换
   * @param str
   */
  static parseDate(str: string): any {
    if (U.StringUtils.isBank(str)) {
      return null;
    }
    return parse(str, U.DateUtils.masks.day, new Date())
  }


  /**
   *  日期转换
   * @param date
   */
  static formatDate(date: any): any {
    if (U.StringUtils.isBank(date)) {
      return "";
    }

    if (date instanceof Date) {
      return format(date, U.DateUtils.masks.day);
    }
    return date;
  }


  /**
   *  日期转换
   * @param date
   * @param mask
   */
  static formatDateExt(date: any, mask: any): any {
    if (U.StringUtils.isBank(date)) {
      return "";
    }
    if (date instanceof Date) {
      return format(date, mask);
    }
    return date;
  }
}

export class HD {
  static toGetOptions = (params: any) => {
    const options: any = {};
    let httpParams: HttpParams = new HttpParams();
    for (const k in params) {
      /*过滤内部函数*/
      if (params[k] instanceof Function) {
        continue;
      }
      httpParams = httpParams.set(k, params[k]);
    }
    options.params = httpParams;
    return options;
  }

  static toDeleteOptions = (params: any) => {
    const options: any = {};
    let httpParams: HttpParams = new HttpParams();
    for (const k in params) {
      /*过滤内部函数*/
      if (params[k] instanceof Function) {
        continue;
      }
      httpParams = httpParams.set(k, params[k]);
    }
    options.params = httpParams;
    return options;
  }

  static toPostOptions = (params: any) => {
    const formData = new FormData();
    for (const k in params) {
      /*过滤内部函数*/
      if (params[k] instanceof Function) {
        continue;
      }
      formData.set(k, params[k]);
    }
    return formData;
  }

  static toPutOptions = (params: any) => {
    const formData = new FormData();
    for (const k in params) {
      /*过滤内部函数*/
      if (params[k] instanceof Function) {
        continue;
      }
      formData.set(k, params[k]);
    }
    return formData;
  }

  static toOptions = (params: any) => {
    const options: any = {};
    let httpParams: HttpParams = new HttpParams();
    for (const k in params) {
      /*过滤内部函数*/
      if (params[k] instanceof Function) {
        continue;
      }
      httpParams = httpParams.set(k, params[k]);
    }
    options.params = httpParams;
    return options;
  }

  static toHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}


export class V {

  /**
   * 手机号验证
   */
  static mobileValidator = (control: UntypedFormControl): any => {
    const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    const valid = myreg.test(control.value);
    // console.log("mobile的校验结果是:"+valid);
    return valid ? null : {format: {mistake: '手机号格式错误'}};
  }

  /**
   * 手机号验证
   */
  static testValidator = (control: UntypedFormControl): any => {
    return U.StringUtils.isNotBank(control.value) ? null : {required: true, mistake: '手机号格式错误'};
  }

  /**
   * 身份证验证
   */
  static identityValidator = (control: UntypedFormControl): any => {
    const myreg = /^\d{17}[\d|x]|\d{15}$/;
    const valid = myreg.test(control.value);
    // console.log("mobile的校验结果是:"+valid);
    return valid ? null : {identity: {mistake: '身份证格式错误'}};
  }

  /**
   * 信用卡格式验证
   */
  static creditCardValidator = (control: UntypedFormControl): any => {
    const cardNoRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    const valid = cardNoRegex.test(control.value);
    return valid ? null : {format: {mistake: '信用卡格式错误！'}};
  }

  /**
   * 储蓄卡格式验证
   */
  static debitCardValidator = (control: UntypedFormControl): any => {
    const cardNoRegex = /^(\d{16}|\d{19})$/;
    const valid = cardNoRegex.test(control.value);
    return valid ? null : {format: {mistake: '储蓄卡格式错误！'}};
  }

// export function mobileAsyncValidator(control: FormControl): any {
//   const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
//   const valid = myreg.test(control.value);
//   // console.log("mobile的校验结果是:"+valid);
//   return Observable.of(valid ? null : {mobile: true}).delay(5000);
// }

  static equalValidator = (group: UntypedFormGroup): any => {
    const password: UntypedFormControl = group.get('password') as UntypedFormControl;
    const pconfirm: UntypedFormControl = group.get('pconfirm') as UntypedFormControl;
    const valid = false;
    if (password && pconfirm) {
      //   valid = (password.value === pconfirm.value);
    }
    // console.log("密码校验结果:"+valid);
    return valid ? null : {equal: {descxxx: '密码和确认密码不匹配'}};
  }

  /**
   * 数字验证
   */
  static digitalValidator = (control: UntypedFormControl): any => {
    const reg = /^\d+$|^\d+[.]?\d+$/;
    const valid = reg.test(control.value);
    // console.log("mobile的校验结果是:"+valid);
    return valid ? null : {format: {mistake: '只能输入数字'}};
  }

}

export class Regexp {
  // 正整数
  static POSITIVE_INTEGER = /^[0-9]*$/;
  // 有两位小数的正实数
  static DIGITAL = /^[0-9]+(.[0-9]{0,2})?$/;
  // 金额 允许正负数
  static MONEY = "/(^([-]?)[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^([-]?)(0){1}$)|(^([-]?)[0-9]\.[0-9]([0-9])?$)/";


}


export class L {
  static debug(obj: any) {
    console.debug(obj);
  }

  static log(obj: any) {
    console.log(obj);
  }

  static info(obj: any) {
    console.info(obj);
  }

  static error(obj: any) {
    console.error(obj);
  }
}


