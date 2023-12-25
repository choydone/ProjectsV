import {Component, Input, OnInit} from '@angular/core';
import {CopyrightBaseComponent} from "../copyright-base.component";
import {U} from "../../../../starter/utils/utils";

@Component({
  selector: 'app-doc-preview',
  templateUrl: './doc-preview.component.html',
  styleUrls: ['./doc-preview.component.scss']
})
export class DocPreviewComponent extends CopyrightBaseComponent implements OnInit {

  @Input() docData: any = null;

  // 当前记录的状态操作列表
  currentOrderCopyrightLogbackData: any[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }


  showDocDataAction(): void {
    this.currentOrderCopyrightLogbackData = [];
    if (U.ObjectUtils.isNull(this.docData)) {
      return;
    }

    this.currentOrderCopyrightLogbackData = JSON.parse(this.docData);

    this.currentOrderCopyrightLogbackData.forEach((x) => {
      let docNames: any[] = [];
      if (!x.docNames) {
        // @ts-ignore
        x.paths.forEach((path) => {
          docNames = [...docNames, "缺失文件名"];
        })
        x.docNames = docNames;
      }
    })

  }

}
