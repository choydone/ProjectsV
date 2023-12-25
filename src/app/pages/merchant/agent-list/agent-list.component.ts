import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {Pagination} from "../../../starter/utils/pagination";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Checkbox} from "../../../starter/elements/table/checkbox";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {UserService} from "../../../shared/admin/user.service";
import {WebCommandService} from "../../../starter/shared/web-command-service";
import {RoleService} from "../../../shared/admin/role.service";
import {P, R, U, V} from "../../../starter/utils/utils";
import {Observable} from "rxjs";
import {AgentService} from "../../../shared/merchant/agent.service";

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss']
})
export class AgentListComponent extends BaseComponent {

  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading = false;

  users: any[] = [];

  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;
  // 当前操作
  currentAction = this.add;
  validateForm!: UntypedFormGroup;

  // 组件
  elements: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private agentService: AgentService, private userService: UserService) {
    super(securityService, webCommandService);
  }

  override ngOnInit(): void {

    this.validateForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      accountName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      mobile: [null, [Validators.required, V.mobileValidator]],
      email: [null, [Validators.required, Validators.email]],
      status: [true, [Validators.required]],
      promoterId: [true, [Validators.required]],
      remarks: [null]
    });

    this.search(true);

    this.searchUser();
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
    const observable: Observable<R> = this.agentService.searchAtPage(query);
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
      this.validateForm.get('promoterId')?.setValue(obj.promoterId);
      this.validateForm.get('name')?.setValue(obj.name);
      this.validateForm.get('mobile')?.setValue(obj.mobile);
      this.validateForm.get('email')?.setValue(obj.email);
      this.validateForm.get('accountName')?.setValue(obj.accountName);
      this.validateForm.get('status')?.setValue(obj.status);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
      if (this.validateForm.get("password")?.hasValidator(Validators.required)) {
        this.validateForm.get("password")?.removeValidators(Validators.required);
      }
    } else {
      this.currentAction = this.add;
      this.validateForm.get('status')?.setValue(20);
      if (!this.validateForm.get("password")?.hasValidator(Validators.required)) {
        this.validateForm.get("password")?.addValidators(Validators.required);
      }
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
      form.action = this.currentAction;
      form.id = this.validateForm.get('id')?.value;
      form.promoterId = this.validateForm.get('promoterId')?.value;
      form.name = this.validateForm.get('name')?.value;
      form.password = this.validateForm.get('password')?.value;
      form.accountName = P.preText(this.validateForm.get('accountName')?.value);
      form.mobile = P.preText(this.validateForm.get('mobile')?.value);
      form.email = P.preText(this.validateForm.get('email')?.value);
      form.status = this.validateForm.get('status')?.value;
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.agentService.saveAction(form);
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
  removeAction(obj: any): void {
    this.nzTableLoading = true;
    const observable: Observable<R> = this.agentService.removeAction(obj.id);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search(true);
      }
    });
  }

  /**
   * 重置密码事件
   */
  resetPasswordAction(obj: any): void {
    const observable: Observable<R> = this.agentService.resetPasswordAction(obj.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
      }
    });
  }

  searchUser(): void {
    const observable: Observable<R> = this.userService.search({});
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.users = data.t;
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
}
