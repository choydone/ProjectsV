import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../starter/utils/pagination";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {P, R, U} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";
import {OrdersCapitalService} from "../../../shared/mall/orders-capital.service";
import {AgentService} from "../../../shared/merchant/agent.service";
import {ProductService} from "../../../shared/mall/product.service";

@Component({
  selector: 'app-orders-capital-list',
  templateUrl: './orders-capital-list.component.html',
  styleUrls: ['./orders-capital-list.component.scss']
})
export class OrdersCapitalListComponent extends BaseComponent {
  isCollapse = false;
  formModel!: UntypedFormGroup;

  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading = false;


  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;
  validateForm!: UntypedFormGroup;
  // 代理商
  agents: any[] = [];
  // 产品列表
  products: any[] = [];

  // 当前处理中的记录
  currentProductSaleRule: any = {};

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private ordersCapitalService: OrdersCapitalService, private agentService: AgentService,
              private productService: ProductService,) {
    super(securityService, webCommandService);
  }


  override ngOnInit(): void {
    this.formModel = this.fb.group({
      searchValue: [null],
      customer: [null],
      mobile: [null],
      extOrdersNo: [null],
      status: [null],
      productId: [null],
      agentId: [null],
      ordersStatus: [null],
      rangeDate: [null],
    });

    this.validateForm = this.fb.group({
      ordersId: [null, [Validators.required]],
      billName: [null, [Validators.required]],
      money: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
    });

    this.search(true);

    this.searchAgents();

    this.searchProducts();
  }

  /**
   * 查询列表
   */
  search(reset: boolean = false): void {
    if (reset) {
      this.pagination.reset();
    }
    // 获取基础数据-分页数据
    const query: any = this.pagination.query();
    this.getQueryForm(this.formModel.value, query);

    this.nzTableLoading = true;
    const observable: Observable<R> = this.ordersCapitalService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }

  /**
   * 打开界面
   */
  openViewAction(): void {
    this.validateForm.reset();
    this.nzModalVisible = true;
    this.nzModalBtnLoading = false;
  }

  /**
   * 关闭窗口事件
   */
  closeViewAction(): void {
    this.nzModalVisible = false;
    this.nzModalBtnLoading = false;
    this.validateForm.reset();
  }

  /**
   * 保存事件
   */
  saveAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      this.nzModalBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.id = this.validateForm.get('id')?.value;
      form.ordersId = this.validateForm.get('ordersId')?.value;
      form.billName = P.preText(this.validateForm.get('billName')?.value);
      form.money = this.validateForm.get('money')?.value;
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.ordersCapitalService.additionalAction(form);
      observable.subscribe((data) => {
        this.nzModalBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.search();
          this.closeViewAction();
        }
      });
    }
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

  /**
   * 导出事件
   */
  exportAction(): void {
    // 获取基础数据-分页数据
    const query: any = {};
    this.getQueryForm(this.formModel.value, query);
    const observable: Observable<R> = this.ordersCapitalService.exportAction(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        window.open(data.t, '_blank');
      }
    });
  }

  searchAgents(): void {
    const query: any = {};
    const observable: Observable<R> = this.agentService.search(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.agents = data.t;
      }
    });
  }

  searchProducts(): void {
    const query: any = {};
    const observable: Observable<R> = this.productService.search(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.products = data.t;
      }
    });
  }

  gotoPageAction(obj: any) {
    this.securityService.routerLink("/mall/orders_list",this.router);
  }

}
