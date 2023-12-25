import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isCollapsed = false;

  menus: Array<any> = [];

  // 准备用它来发射事件
  @Output()
  collapsedEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    // 查询当前登录账号的菜单列表

  }



  clickCollapsed() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedEvent.emit(this.isCollapsed);
  }

}
