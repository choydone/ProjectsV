import { Component, OnDestroy } from '@angular/core';
import { NzIconService } from "ng-zorro-antd/icon";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProjectsV';

  constructor(private iconService: NzIconService) {
    this.iconService.fetchFromIconfont({
      scriptUrl: '//at.alicdn.com/t/c/font_3975547_fgshkp5x59h.js'
    });
  }


}
