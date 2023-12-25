import {U} from "./utils";

export class DocStyle {

  static autoFileName(path: any): string {
    if (U.StringUtils.isBank(path)) {
      return "未知";
    }
    return U.getValueAfterLastDot(path, "/");
  }

  static autoConvert(path: any): string {
    if (U.StringUtils.isBank(path)) {
      return "../assets/images/filetypes/unknow.png";
    }
    const fileType = U.getValueAfterLastDot(path);
    if (U.isStringInArrayIgnoreCaseAndTrim(fileType, ["png", 'gif'])) {
      return path;
    }

    if (U.isStringInArrayIgnoreCaseAndTrim(fileType, ["doc", 'docx'])) {
      return "../assets/images/filetypes/doc.png";
    }

    if (U.isStringInArrayIgnoreCaseAndTrim(fileType, ["xls", 'xlsx'])) {
      return "../assets/images/filetypes/xls.png";
    }

    if (U.isStringInArrayIgnoreCaseAndTrim(fileType, ['pdf', 'ppt', 'rar', 'txt', 'zip'])) {
      return "../assets/images/filetypes/" + fileType.toLowerCase() + ".png";
    }
    return "../assets/images/filetypes/unknow.png";
  }
}
