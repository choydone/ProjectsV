import {Component, Input, OnInit} from '@angular/core';
import {CopyrightBaseComponent} from "../copyright-base.component";
import {U} from "../../../../starter/utils/utils";

@Component({
  selector: 'app-flow-preview',
  templateUrl: './flow-preview.component.html',
  styleUrls: ['./flow-preview.component.scss']
})
export class FlowPreviewComponent extends CopyrightBaseComponent implements OnInit {

  @Input() status: number = -1;
  @Input() statusText: any = "无效";
  @Input() data: any = null;

  currentOrderCopyrightFlowData: any[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  showStatusAction(): void {
    this.currentOrderCopyrightFlowData = [];
    if (U.StringUtils.isBank(this.data)) {
      return;
    }
    this.currentOrderCopyrightFlowData = JSON.parse(this.data);
  }

}
