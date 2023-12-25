import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

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
    this.message.warning("没有文件")

  }
}
