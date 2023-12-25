import {Component, Input, OnInit} from '@angular/core';
import {U} from "../../../../starter/utils/utils";

@Component({
  selector: 'app-price-preview',
  templateUrl: './price-preview.component.html',
  styleUrls: ['./price-preview.component.scss']
})
export class PricePreviewComponent implements OnInit {

  @Input() status: number = -1;
  @Input() statusText: any = "无效";
  @Input() data: any = null;

  currentMallPriceData: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  showStatusAction(): void {
    this.currentMallPriceData = [];
    if (U.StringUtils.isBank(this.data)) {
      return;
    }
    this.currentMallPriceData = JSON.parse(this.data);
  }

}
