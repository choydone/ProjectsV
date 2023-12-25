import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {Pagination} from "../../../starter/utils/pagination";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {LoggerService} from "../../../shared/admin/logger.service";
import {R} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-logger-list',
  templateUrl: './logger-list.component.html',
  styleUrls: ['./logger-list.component.scss']
})
export class LoggerListComponent extends BaseComponent {

  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading = false;


  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService, private loggerService: LoggerService) {
    super(securityService, webCommandService);
  }

  override ngOnInit(): void {
    this.search(true)
  }

  search(reset: boolean = false): void {
    if (reset) {
      this.pagination.reset();
    }
    // 获取基础数据-分页数据
    const query: any = this.pagination.query();
    // 表单数据
    query.searchValue = this.tplSearchValue;
    if (!this.tplStatus) {
      // 未选中全部，则显示正常可用的
      query.status = 20;
    }

    this.nzTableLoading = true;
    const observable: Observable<R> = this.loggerService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }


}
