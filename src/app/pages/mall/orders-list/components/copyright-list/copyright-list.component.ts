import {Component, EventEmitter, Output} from '@angular/core';
import {Pagination} from "../../../../../starter/utils/pagination";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {BaseComponent} from "../../../../base.component";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../../../starter/shared/security-service";
import {OrdersCopyrightService} from "../../../../../shared/mall/orders-copyright.service";
import {R, U} from "../../../../../starter/utils/utils";
import {Observable} from "rxjs";
import {WebCommandService} from "../../../../../starter/shared/web-command-service";

@Component({
  selector: 'app-copyright-list',
  templateUrl: './copyright-list.component.html',
  styleUrls: ['./copyright-list.component.scss']
})
export class CopyrightListComponent extends BaseComponent {
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
  statisticalData: any = {};

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private ordersCopyrightService: OrdersCopyrightService) {
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

    this.calcStatus();

    // 这里根据对应的ID 进行数据查询
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
    const observable: Observable<R> = this.ordersCopyrightService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }

  calcStatus(): void {
    const observable: Observable<R> = this.ordersCopyrightService.calcStatusByOrdersId(this.currentOrders.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.statisticalData = data.t;
      }
    });
  }

  closeViewAction(): void {
    this.nzModalVisible = false;
    this.currentOrders = {};
    this.pagination.clear();
    this.nzModalBtnLoading = false;

    this.closeEvent.emit();
  }

  isShowDocIcon(obj: any): boolean {
    const logback: any = obj.docData;
    return !U.StringUtils.isBank(logback);
  }

}
