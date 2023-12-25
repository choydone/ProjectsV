import { Directive, OnInit } from "@angular/core";
import { AliyunService } from "../../../shared/aliyun.service";
import { Observable } from "rxjs";
import { Result } from "../../model/result";
import { ResultFilter } from "../../utils/result-filter";
import { NzUploadFile } from "ng-zorro-antd/upload";

@Directive()
export abstract class AliyunComponent implements OnInit {

  ossData: any = {}

  protected constructor(public aliyunService: AliyunService) {
  }

  ngOnInit(): void {
  }

  getOssPolicy(objectName: any): void {
    let query: any = {};
    query.prefix = objectName;
    const observable: Observable<Result<any>> | null = this.aliyunService.ossPolicyAction(query);
    observable.subscribe((data) => {
      if (ResultFilter.isSuccess(data)) {
        this.ossData = data.t;
        this.ossData.success_action_status = 200;
      }
    });
  }

  getExtraData = (file: NzUploadFile): {} => {
    const {accessId, policy, signature} = this.ossData;
    return {
      key: file.url,
      OSSAccessKeyId: accessId,
      policy,
      Signature: signature
    };
  };

  transformFile = (file: NzUploadFile): NzUploadFile => {
    // const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + "-" + file.name;
    file.url = this.ossData.dir + filename;
    return file;
  };

}
