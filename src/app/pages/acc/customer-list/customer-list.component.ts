import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {Pagination} from "../../../starter/utils/pagination";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {WebCommandService} from "../../../starter/shared/web-command-service";
import {CustomerService} from "../../../shared/acc/customer.service";
import {P, R, U} from "../../../starter/utils/utils";

@Component({
  selector: 'app-enterprise-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent extends BaseComponent {

  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading = false;

  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;
  // 当前操作
  currentAction = this.add;
  validateForm!: UntypedFormGroup;
  // 解析按钮loading标志
  parseBtnLoading = false;


  // 已有账号列表
  isVisibleAccount = false;
  // 分页参数
  accountPagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableAccountLoading = false;
  currentCustomerData: any = {};

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private customerService: CustomerService) {
    super(securityService, webCommandService);
  }

  override ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      docData: [null],
      name: [null, [Validators.required]],
      uniqueKey: [null],
      type: [20],
      establishDate: [null],
      address: [null],
      remarks: [null],
      status: [null]
    });

    this.search(true);

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
    // 表单数据
    query.searchValue = this.tplSearchValue
    if (!this.tplStatus) {
      // 未选中全部，则显示正常可用的
      query.status = 20;
    }
    this.nzTableLoading = true;
    const observable: Observable<R> = this.customerService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }

  /**
   * 打开窗口事件
   */
  openViewAction(obj?: any): void {
    this.validateForm.reset();
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentAction = this.edit;
      this.validateForm.get('id')?.setValue(obj.id);
      this.validateForm.get('docData')?.setValue(obj.docData);
      this.validateForm.get('name')?.setValue(obj.name);
      this.validateForm.get('uniqueKey')?.setValue(obj.uniqueKey);
      this.validateForm.get('type')?.setValue(obj.type);
      this.validateForm.get('status')?.setValue(obj.status);
      this.validateForm.get('establishDate')?.setValue(obj.establishDate);
      this.validateForm.get('address')?.setValue(obj.address);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
    } else {
      this.currentAction = this.add;
      this.validateForm.get('type')?.setValue(20);
      this.validateForm.get('status')?.setValue(20);
    }
    this.nzModalVisible = true;
    this.nzModalBtnLoading = false;
  }

  /**
   * 关闭窗口事件
   */
  closeViewAction(): void {
    this.validateForm.reset();
    this.nzModalVisible = false;
    this.nzModalBtnLoading = false;
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
      form.action = this.currentAction;
      form.id = this.validateForm.get('id')?.value;
      form.name = this.validateForm.get('name')?.value;
      form.uniqueKey = P.preText(this.validateForm.get('uniqueKey')?.value);
      form.type = this.validateForm.get('type')?.value;
      form.establishDate = P.formatDate(this.validateForm.get('establishDate')?.value);
      form.address = P.preText(this.validateForm.get('address')?.value);
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      form.status = this.validateForm.get('status')?.value;
      form.docData = P.preText(this.validateForm.get('docData')?.value);

      const observable: Observable<R> = this.customerService.saveAction(form);
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

  removeAction(obj: any): void {
    this.nzTableLoading = true;
    const observable: Observable<R> = this.customerService.removeAction(obj);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search(true);
      }
    });
  }


  /**
   * 显示数据记录
   */
  override tplCheckedStatus(event: any): void {
    super.tplCheckedStatus(event);
    this.search(true);
  }

  // 企业关联的的账号
  openAccountViewAction(obj: any) {
    this.currentCustomerData = obj;
    this.isVisibleAccount = true;
    this.searchAccount(true);
  }

  closeAccountViewAction() {
    this.isVisibleAccount = false;
    this.currentCustomerData = {};
  }

  searchAccount(reset: boolean = false): void {
    if (reset) {
      this.accountPagination.reset();
    }
    this.nzTableAccountLoading = true;
    // 获取基础数据-分页数据
    const query: any = this.accountPagination.query();
    query.customerId = this.currentCustomerData.id;
    // const observable: Observable<R> = this.accountService.searchAtPage(query);
    // observable.subscribe((data) => {
    //   if (R.isSuccess(data)) {
    //     this.accountPagination.fill(data);
    //   }
    //   this.nzTableAccountLoading = false
    // });
  }
}
