import {Injectable} from "@angular/core";
import {U} from "../utils/utils";
import {HttpClient} from "@angular/common/http";
import {ClipboardService} from "ngx-clipboard";
import {NzMessageService} from "ng-zorro-antd/message";


@Injectable({
  providedIn: 'root'
})
export class WebCommandService {
  constructor(private clipboardService: ClipboardService, private message: NzMessageService) {
  }

  clickCopyTextCommand(text: string, message: string = "复制成功"): void {
    if (U.StringUtils.isBank(text)) {
      this.message.warning("无效的文本内容，复制失败！")
      return;
    }
    this.clipboardService.copy(text);
    this.message.info(message);
  }

}
