import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../starter/utils/pagination";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {WebCommandService} from "../../../starter/shared/web-command-service";
import {AccountService} from "../../../shared/acc/account.service";
import {P, R, U} from "../../../starter/utils/utils";
import {ParameterService} from "../../../shared/admin/parameter.service";

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent extends BaseComponent {
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

  isSelectCustomerLoading = false;
  parameters: any[] = [];
  parameterOptions: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private accountService: AccountService, private parameterService: ParameterService) {
    super(securityService, webCommandService);
  }

  override ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      customer: [null, [Validators.required]],
      name: [null, [Validators.required]],
      account: [null, [Validators.required]],
      password: [null, [Validators.required]],
      website: [null, [Validators.required]],
      action: [null, [Validators.required]],
      status: [null, [Validators.required]],
      remarks: [null]
    });

    this.search(true);

    this.searchParameter();
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
    query.type = 20;
    this.nzTableLoading = true;
    const observable: Observable<R> = this.accountService.searchAtPage(query);
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
      this.validateForm.get('customer')?.setValue(obj.customer);
      this.validateForm.get('name')?.setValue(obj.name);
      this.validateForm.get('account')?.setValue(obj.account);
      this.validateForm.get('password')?.setValue(obj.password);
      this.validateForm.get('website')?.setValue(obj.website);
      this.validateForm.get('action')?.setValue(obj.action);
      this.validateForm.get('status')?.setValue(String(obj.status));
      this.validateForm.get('remarks')?.setValue(obj.remarks);
    } else {
      this.validateForm.get('status')?.setValue("20");
      this.currentAction = this.add;
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
      form.customer = this.validateForm.get('customer')?.value;
      form.name = P.preText(this.validateForm.get('name')?.value);
      form.account = P.preText(this.validateForm.get('account')?.value);
      form.password = P.preText(this.validateForm.get('password')?.value);
      form.website = P.preText(this.validateForm.get('website')?.value);
      form.action = P.preText(this.validateForm.get('action')?.value);
      form.status = this.validateForm.get('status')?.value;
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.accountService.saveAction(form);
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
   * 删除事件
   */
  removeAction(role: any): void {
    this.nzTableLoading = true;
    const form: any = {};
    form.id = role.id;
    const observable: Observable<R> = this.accountService.removeAction(form);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search();
      }
    });
  }


  /**
   * 客户查询控件服务
   */
  searchParameter(): void {
    const query: any = {};
    query.status = 20;
    query.parentCode = "acc_account";
    this.parameterOptions = [];
    const observable: Observable<R> = this.parameterService.search(query);
    observable.subscribe((data) => {
      this.isSelectCustomerLoading = false;
      if (R.isSuccess(data)) {
        this.parameters = data.t;

        this.parameters.forEach(x => {
          this.parameterOptions = [...this.parameterOptions, x.name];
        })
      }
    });
  }

  getParameterAction(): void {
    const name: any = this.validateForm.get("name")?.value;
    this.validateForm.get("website")?.setValue("");
    this.validateForm.get("action")?.setValue("");
    this.parameters.forEach((parameter: any) => {
      if (parameter.name === name) {
        let val = JSON.parse(parameter.val);
        this.validateForm.get("website")?.setValue(val.url);
        this.validateForm.get("action")?.setValue(val.useFunc);
      }
    })
  }

  /**
   * 显示数据记录
   */
  override tplCheckedStatus(event: any): void {
    super.tplCheckedStatus(event);
    this.search(true);
  }

}
