import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input() fileName: string = '未找到';
  @Input() docData: any;

  constructor(private message: NzMessageService) {
  }

  ngOnInit(): void {
  }

  downloadAction(): void {
    if (this.docData) {
      window.open(this.docData, '_blank');
      return;
    }
    this.message.warning("无效的文件ID")

  }
}
