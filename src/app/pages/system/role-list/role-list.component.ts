import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {Observable} from 'rxjs';
import {RoleService} from "../../../shared/admin/role.service";
import {Pagination} from "../../../starter/utils/pagination";
import {Echeckbox} from "../../../starter/elements/echeckbox";
import {SecurityService} from "../../../starter/shared/security-service";
import {P, R, U} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent extends BaseComponent {
  //Tag标签 颜色集
  tagColors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple",
    "magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple",
    "magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"]

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


  // 角色权限设置弹框
  nzModalAuthorizeVisible = false;
  // 多选控制器集合
  multiBoxes: any = {};

  // 未授权的初始权限
  mandates: any[] = [];
  currentAuthorizationRoleMenuSet: Set<Number> = new Set<number>();
  currentAuthorizationRolePermissionSet: Set<Number> = new Set<number>();
  // 当前授权角色
  currentAuthorizeRole: any = {};

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService,webCommandService: WebCommandService, private roleService: RoleService) {
    super(securityService,webCommandService);
  }

  override ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      status: [true, [Validators.required]],
      remarks: [null]
    });


    this.search(true)

    this.initAuthorizeData();

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
    const observable: Observable<R> = this.roleService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }

  initAuthorizeData(): void {
    const observable: Observable<R> = this.roleService.initAuthorizeData({});
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.mandates = data.t;
        this.mandates.forEach((mandate) => {
          // @ts-ignore
          mandate.forEach((mdate) => {
            if (mdate.children && mdate.children.length > 0) {
              const child: any[] = mdate.children;
              child.forEach((mm) => {
                this.multiBoxes[mm.id] = new Echeckbox();
                this.multiBoxes[mm.id].initData(mm.permissionList);
              })
            } else {
              this.multiBoxes[mdate.id] = new Echeckbox();
              this.multiBoxes[mdate.id].initData(mdate.permissionList);
            }
          })
        })
      }
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
      this.validateForm.get('name')?.setValue(obj.name);
      this.validateForm.get('code')?.setValue(obj.code);
      const status = obj.status === 20;
      this.validateForm.get('status')?.setValue(status);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
    } else {
      this.currentAction = this.add;
      this.validateForm.get('status')?.setValue(true);
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
      form.name = this.validateForm.get('name')?.value;
      form.code = this.validateForm.get('code')?.value;
      form.status = this.validateForm.get('status')?.value;
      form.status = form.status ? '20' : '30';
      form.statusExplain = '';
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.roleService.saveAction(form);
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
   * 删除角色事件
   */
  removeAction(role: any): void {
    this.nzTableLoading = true;
    const form: any = {};
    form.id = role.id;
    const observable: Observable<R> = this.roleService.removeAction(form);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search();
      }
    });
  }

  /**
   * 打开授权窗口事件
   */
  openAuthorizeViewAction(obj: any): void {
    if (U.CollectionUtils.isEmpty(this.mandates)) {
      this.message.warning("当前权限设置功能异常，请联系管理员！")
      return;
    }

    this.currentAuthorizeRole = obj;
    // 需要获取当前角色的菜单列表以及权限列表。
    const observable: Observable<R> = this.roleService.searchAtResource(obj.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.currentAuthorizationRolePermissionSet.clear();
        this.currentAuthorizationRoleMenuSet.clear();
        if (U.CollectionUtils.isNotEmpty(data.t.menus)) {
          // @ts-ignore
          data.t.menus.forEach((item) => {
            this.currentAuthorizationRoleMenuSet.add(item.id);
          })
        }
        if (U.CollectionUtils.isNotEmpty(data.t.permissions)) {
          // @ts-ignore
          data.t.permissions.forEach((item) => {
            this.currentAuthorizationRolePermissionSet.add(item.id);
          })
        }

        this.mandates.forEach((mandate) => {
          this.initMenuAndPermissionFromRole(mandate);
        })

        // 需要重置所有的选着框
        this.mandates.forEach((mandate) => {
          // @ts-ignore
          mandate.forEach((mdate) => {
            if (mdate.children && mdate.children.length > 0) {
              const child: any[] = mdate.children;
              child.forEach((mm) => {
                this.multiBoxes[mm.id].initData(mm.permissionList);
              })
            } else {
              this.multiBoxes[mdate.id].initData(mdate.permissionList);
            }
          })
        })

        this.nzModalAuthorizeVisible = true;
      }
    });
  }

  /**
   * 初始化当前授权角色的权限数据
   */
  initMenuAndPermissionFromRole(menus: Array<any>): void {
    menus.forEach((menu) => {
      menu.checked = this.currentAuthorizationRoleMenuSet.has(menu.id);
      if (U.CollectionUtils.isNotEmpty(menu.permissionList)) {
        // @ts-ignore
        menu.permissionList.forEach((permission) => {
          permission.checked = this.currentAuthorizationRolePermissionSet.has(permission.id);
        })
      }

      if (U.CollectionUtils.isNotEmpty(menu.children)) {
        this.initMenuAndPermissionFromRole(menu.children);
      }
    })
  }

  /**
   * 点击单个checkbox
   * @param events
   * @param mandate
   */
  clickCheckboxAction(events: any[], mandate: any): void {
    if (events.length == 0) {
      return;
    }

    let notCheckedIdLs: any = [];
    let checkedIdLs: any = [];
    events.forEach((event) => {
      if (event.checked) {
        checkedIdLs = [...checkedIdLs, event.value];
      } else {
        notCheckedIdLs = [...notCheckedIdLs, event.value];
      }
    })
    const form: any = {};
    form.id = this.currentAuthorizeRole.id;
    form.checkedIdsStr = checkedIdLs.join(",");
    form.notCheckedIdsStr = notCheckedIdLs.join(",");
    const observable: Observable<R> = this.roleService.saveRoleResourceAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.multiBoxes[mandate.id].updateSingleChecked()
      }
    });
  }

  /**
   * 点击所有checkbox
   * @param event
   * @param mandate
   */
  clickAllCheckboxAction(event: any[], mandate: any): void {
    console.log(event)
    console.log(mandate)
    const permissionList: any[] = mandate.permissionList;
    if (U.CollectionUtils.isEmpty(permissionList)) {
      return;
    }
    let permissionIdLs = permissionList.map(permission => {
      return permission.id;
    })
    console.log(permissionIdLs)
    const form: any = {};
    form.id = this.currentAuthorizeRole.id;
    if (event) {
      form.checkedIdsStr = permissionIdLs.join(",");
      form.notCheckedIdsStr = "";
    } else {
      form.checkedIdsStr = "";
      form.notCheckedIdsStr = permissionIdLs.join(",");
    }
    const observable: Observable<R> = this.roleService.saveRoleResourceAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.multiBoxes[mandate.id].updateAllChecked()
      }
    });
    //multiBoxes[mm.id].updateAllChecked()
  }

  /**
   * 显示数据记录
   */
  override tplCheckedStatus(event: any): void {
    super.tplCheckedStatus(event);
    this.search(true);
  }


}

