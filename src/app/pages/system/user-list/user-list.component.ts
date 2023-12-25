import {Component} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {UserService} from "../../../shared/admin/user.service";
import {BaseComponent} from '../../base.component';
import {Observable} from "rxjs";
import {RoleService} from "../../../shared/admin/role.service";
import {Checkbox} from "../../../starter/elements/table/checkbox";
import {Pagination} from "../../../starter/utils/pagination";
import {SecurityService} from "../../../starter/shared/security-service";
import {P, R, U, V} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BaseComponent {

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


  /**
   * 角色列表
   */
  roles: any[] = [];
  // 角色表格加载标志
  tableCheckbox!: Checkbox;

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, private userService: UserService, webCommandService: WebCommandService,
              private roleService: RoleService) {
    super(securityService,webCommandService);
    this.tableCheckbox = new Checkbox();
  }

  override ngOnInit(): void {

    this.validateForm = this.fb.group({
      id: [null],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      mobile: [null, [Validators.required, V.mobileValidator]],
      email: [null, [Validators.required, Validators.email]],
      realName: [null, [Validators.required]],
      status: [true, [Validators.required]],
      remarks: [null]
    });

    this.search(true);

    this.searchRoles();
  }

  /**
   *  查询角色列表
   */
  searchRoles(): void {
    const query: any = {};
    query.status = 20;
    const observable: Observable<R> = this.roleService.search(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.roles = data.t;
        this.tableCheckbox.initData(this.roles, false);
      }
    });
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
    const observable: Observable<R> = this.userService.searchAtPage(query);
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
    this.tableCheckbox.initData(this.roles, true);
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentAction = this.edit;
      const observable: Observable<R> = this.userService.searchRolesById(obj.id);
      observable.subscribe((data) => {
        if (R.isSuccess(data)) {
          const _user: any = data.t;
          if (U.CollectionUtils.isNotEmpty(_user.roleIdLs)) {
            // @ts-ignore
            _user.roleIdLs.forEach((roleId) => {
              this.tableCheckbox.addCheckedId(Number(roleId));
              this.tableCheckbox.refreshCheckedStatus();
            })
          }
        }
      });

      this.validateForm.get('id')?.setValue(obj.id);
      this.validateForm.get('userName')?.setValue(obj.userName);
      this.validateForm.get('mobile')?.setValue(obj.mobile);
      this.validateForm.get('email')?.setValue(obj.email);
      this.validateForm.get('realName')?.setValue(obj.realName);
      const status = obj.status === 20;
      this.validateForm.get('status')?.setValue(status);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
      if (this.validateForm.get("password")?.hasValidator(Validators.required)) {
        this.validateForm.get("password")?.removeValidators(Validators.required);
      }
    } else {
      this.currentAction = this.add;
      this.validateForm.get('status')?.setValue(true);
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
      console.log(this.validateForm.controls[i].valid)
    }

    if (this.validateForm.valid) {
      this.nzModalBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.action = this.currentAction;
      form.id = this.validateForm.get('id')?.value;
      form.userName = this.validateForm.get('userName')?.value;
      form.password = this.validateForm.get('password')?.value;
      form.realName = this.validateForm.get('realName')?.value;
      form.mobile = this.validateForm.get('mobile')?.value;
      form.email = this.validateForm.get('email')?.value;
      form.status = this.validateForm.get('status')?.value;
      form.status = form.status ? '20' : '30';
      form.statusExplain = '';
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      form.roleIdsStr = this.tableCheckbox.getCurrentCheckedDataString();
      const observable: Observable<R> = this.userService.saveAction(form);
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
   * 删除用户事件
   */
  removeAction(obj: any): void {
    this.nzTableLoading = true;
    const observable: Observable<R> = this.userService.removeAction(obj.id);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search(true);
      }
    });
  }

  /**
   * 重置用户密码事件
   */
  resetPasswordAction(obj: any): void {
    const observable: Observable<R> = this.userService.resetPasswordAction(obj.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
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
