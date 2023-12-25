import {Component, EventEmitter, Output} from '@angular/core';
import {Pagination} from "../../../../../starter/utils/pagination";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {BaseComponent} from "../../../../base.component";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../../../starter/shared/security-service";
import {R, U} from "../../../../../starter/utils/utils";
import {Observable} from "rxjs";
import {WebCommandService} from "../../../../../starter/shared/web-command-service";
import {OrdersCapitalService} from "../../../../../shared/mall/orders-capital.service";

@Component({
  selector: 'app-copyright-list',
  templateUrl: './orders-capital-list.component.html',
  styleUrls: ['./orders-capital-list.component.scss']
})
export class OrdersCapitalListComponent extends BaseComponent {
  @Output() closeEvent = new EventEmitter<void>();

  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading = false;

  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;

  currentOrders: any = {};

  // 统计数据

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private ordersCapitalService: OrdersCapitalService) {
    super(securityService, webCommandService);
  }


  override ngOnInit(): void {

  }

  /**
   *  订单确认操作
   */
  openViewAction(obj: any): void {
    this.currentOrders = obj;
    this.nzModalBtnLoading = false;

    this.search(true);

    this.nzModalVisible = true;
  }

  search(reset: boolean = false): void {
    if (reset) {
      this.pagination.reset();
    }
    // 获取基础数据-分页数据
    const query: any = {};
    query.ordersId = this.currentOrders.id;
    this.nzTableLoading = true;
    const observable: Observable<R> = this.ordersCapitalService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }


  closeViewAction(): void {
    this.nzModalVisible = false;
    this.currentOrders = {};
    this.pagination.clear();
    this.nzModalBtnLoading = false;

    this.closeEvent.emit();
  }

  receivedAction(obj: any, tfl: any): void {
    const remarks = tfl.value;
    if (U.StringUtils.isBank(remarks)) {
      this.message.warning("账单收款关联不能为空！");
      return;
    }
    const form: any = {};
    form.id = obj.id;
    form.remarks = remarks
    this.nzTableLoading = true;
    const observable: Observable<R> = this.ordersCapitalService.receivedAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        tfl.value = "";
        this.search();
      }
      this.nzTableLoading = false;
    });
  }

  expiredAction(obj: any, tfl: any): void {
    const remarks = tfl.value;
    if (U.StringUtils.isBank(remarks)) {
      this.message.warning("账单失效原因不能为空！");
      return;
    }
    const form: any = {};
    form.id = obj.id;
    form.remarks = remarks
    this.nzTableLoading = true;
    const observable: Observable<R> = this.ordersCapitalService.expiredAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        tfl.value = "";
        this.search();
      }
      this.nzTableLoading = false;
    });
  }
}
