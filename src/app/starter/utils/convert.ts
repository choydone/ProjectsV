import {U} from "./utils";

export class Convert {

  static removeSubstring(originalString: string, substringToRemove: string): string {
    if (U.StringUtils.isBank(originalString)) {
      return "";
    }
    return originalString.replace(substringToRemove, "");
  }

  static removeMultiSubstring(originalString: string, multiSubstringToRemove: string[]): string {
    if (U.StringUtils.isBank(originalString)) {
      return "";
    }
    multiSubstringToRemove.forEach(x => {
      originalString = originalString.replace(x, "");
    })
    return originalString;
  }

  static getLastSubstringAfterDelimiter(input: string, delimiter: string): string | null {
    const parts = input.split(delimiter);

    if (parts.length <= 1) {
      return null; // 没有分割符或只有一个分割部分
    }

    return parts[parts.length - 1];
  }

  static extractContentBetweenMarkers(input: string, startMarker: string, endMarker: string): string | null {
    const regexPattern = `${startMarker}(.*?)${endMarker}`;
    const regex = new RegExp(regexPattern);
    const match = regex.exec(input);

    if (match && match[1]) {
      return match[1];
    } else {
      return null; // 未找到匹配内容
    }
  }


  static getRandomElement<T>(array: T[]): T | undefined {
    if (array.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  static deleteElementByIndex<T>(array: T[], index: number): T[] {
    if (index >= 0 && index < array.length) {
      return array.filter((_, idx) => idx !== index);
    } else {
      console.log("无效的索引");
      return array; // 返回原数组，因为索引无效
    }
  }

  static recoveryJSON(json: string): string {
    let pattern = /,(?=\s*})/g;
    return json.replace(pattern, '');
  }

  static randomNumber(min: any, max: any): any {
    // 获取 min 和 max 之间的随机整数
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }





}
