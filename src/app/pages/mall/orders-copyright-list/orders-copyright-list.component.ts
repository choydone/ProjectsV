import {Component} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../starter/utils/pagination";
import {BaseComponent} from "../../base.component";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {OrdersService} from "../../../shared/mall/orders.service";
import {AgentService} from "../../../shared/merchant/agent.service";
import {OrdersCopyrightService} from "../../../shared/mall/orders-copyright.service";
import {Observable} from "rxjs";
import {CopyrightService} from "../../../shared/ipr/copyright.service";
import {P, R, U} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-orders-copyright-list',
  templateUrl: './orders-copyright-list.component.html',
  styleUrls: ['./orders-copyright-list.component.scss']
})
export class OrdersCopyrightListComponent extends BaseComponent {
  isCollapse = false;
  productId = 10030 //软著的编号
  formModel!: UntypedFormGroup;

  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading = false;
  // 代理商
  agents: any[] = [];


  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;
  validateForm!: UntypedFormGroup;

  // 当前操作的记录
  currentOrdersCopyright: any = {}
  // 当前记录的状态操作列表
  currentOrderCopyrightLogbackData: any[] = [];


  //下证成功确认
  nzModalCopyrightStatusVisible = false;
  nzModalCopyrightStatusBtnLoading = false;
  validateCopyrightStatusForm!: UntypedFormGroup;

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService, private ordersService: OrdersService,
              private agentService: AgentService, private ordersCopyrightService: OrdersCopyrightService,
              private copyrightService: CopyrightService) {
    super(securityService, webCommandService);
  }


  override ngOnInit(): void {
    this.formModel = this.fb.group({
      searchValue: [null],
      name: [null],
      author: [null],
      status: [null],
      customer: [null],
      mobile: [null],
      ordersId: [null],
      agentId: [null],
      rangeDate: [null],
    });

    this.validateForm = this.fb.group({
      id: [null, [Validators.required]],
      status: [null, [Validators.required]],
      name: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
      oldName: [null]
    });

    this.validateCopyrightStatusForm = this.fb.group({
      id: [null, [Validators.required]],
      name: [null, [Validators.required]],
      certId: [null, [Validators.required]],
      getTime: [null, [Validators.required]]
    });

    this.search(true);

    this.searchAgents();

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
    const observable: Observable<R> = this.ordersCopyrightService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
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
    const observable: Observable<R> = this.ordersCopyrightService.exportAction(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        window.open(data.t, '_blank');
      }
    });
  }

  cancelableAction(data: any, tfl: any) {
    const remarks = tfl.value;
    if (U.StringUtils.isBank(remarks)) {
      this.message.warning("取消原因说明不能为空！");
      return;
    }
    let form: any = {};
    form.id = data.id;
    form.remarks = remarks;
    const observable: Observable<R> = this.ordersCopyrightService.cancelableAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        tfl.value = "";
        this.search();
      }
    });
  }

  resetCodeAction(data: any, tfl: any) {
    const remarks = tfl.value;
    if (U.StringUtils.isBank(remarks)) {
      this.message.warning("软件重构原因不能为空！");
      return;
    }
    let form: any = {};
    form.id = data.id;
    form.remarks = remarks;
    const observable: Observable<R> = this.ordersCopyrightService.resetCodeAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        tfl.value = "";
        this.search();
      }
    });
  }

  /**
   * 打开窗口事件
   */
  openViewAction(obj: any): void {
    this.validateForm.reset();
    // 根据ID查询新的记录
    const observable: Observable<R> = this.ordersCopyrightService.getById(obj.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.validateForm.get('id')?.setValue(data.t.id);
        this.validateForm.get('oldName')?.setValue(data.t.name);
        this.validateForm.get('status')?.setValue(data.t.status);
        this.currentOrdersCopyright = data.t;
        this.nzModalVisible = true;
        this.nzModalBtnLoading = false;
      }
    });
  }

  /**
   * 保存角色事件
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
      form.name = this.validateForm.get('name')?.value;
      form.status = this.validateForm.get('status')?.value;
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.ordersCopyrightService.changeNameAction(form);
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

  /**
   * 关闭窗口事件
   */
  closeViewAction(): void {
    this.validateForm.reset();
    this.nzModalVisible = false;
    this.nzModalBtnLoading = false;
  }


  openCopyrightStatusAction(obj: any): void {
    this.validateCopyrightStatusForm.reset();
    this.validateCopyrightStatusForm.get('id')?.setValue(obj.id);
    this.validateCopyrightStatusForm.get('name')?.setValue(obj.name);
    // this.validateCopyrightStatusForm.get('certId')?.setValue(obj.certId);
    // this.validateCopyrightStatusForm.get('getTime')?.setValue(parseDate(obj.getTime));
    this.nzModalCopyrightStatusVisible = true;
    this.nzModalCopyrightStatusBtnLoading = false;
  }

  saveCopyrightStatusAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateCopyrightStatusForm.controls
      ) {
      this.validateCopyrightStatusForm.controls[i].markAsDirty();
      this.validateCopyrightStatusForm.controls[i].updateValueAndValidity();
    }

    if (this.validateCopyrightStatusForm.valid) {
      this.nzModalCopyrightStatusBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.id = this.validateCopyrightStatusForm.get('id')?.value;
      form.certId = P.preText(this.validateCopyrightStatusForm.get('certId')?.value);
      form.getTime = P.formatDate(this.validateCopyrightStatusForm.get('getTime')?.value);
      const observable: Observable<R> = this.copyrightService.doneAction(form);
      observable.subscribe((data) => {
        this.nzModalCopyrightStatusBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.search();
          this.closeCopyrightStatusViewAction();
        }
      });
    }
  }

  closeCopyrightStatusViewAction(): void {
    this.validateCopyrightStatusForm.reset();
    this.nzModalCopyrightStatusVisible = false;
    this.nzModalCopyrightStatusBtnLoading = false;
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

  showStatusAction(obj: any): void {
    this.currentOrderCopyrightLogbackData = [];
    const logback: any = obj.statusFlow;
    if (U.StringUtils.isBank(logback)) {
      return;
    }
    this.currentOrderCopyrightLogbackData = JSON.parse(logback);
  }


  isShowDocIcon(obj: any): boolean {
    const logback: any = obj.docData;
    return !U.StringUtils.isBank(logback);
  }
}
