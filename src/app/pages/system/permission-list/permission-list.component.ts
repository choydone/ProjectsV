import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {Tree} from "../../../starter/elements/table/tree";
import {Pagination} from "../../../starter/utils/pagination";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {MenuService} from "../../../shared/admin/menu.service";
import {NzTreeNode} from "ng-zorro-antd/tree";
import {PermissionService} from "../../../shared/admin/permission.service";
import {SecurityService} from "../../../starter/shared/security-service";
import {P, R, U} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent extends BaseComponent {

  tree!: Tree;

  searchValue = '';

  // 菜单数据
  nodes: any[] = [];

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
  // 权限表单
  validateForm!: UntypedFormGroup;
  // 权限表单提示标题
  permissionTableTitle = "[列表] 查询权限列表~";
  // 当前点击菜单的节点列表
  currentClickMenuNode: any = {};
  // 当前点击的节点-包含下属的节点ID集合，逗号分割 例如：1000,10002,10300
  currentClickMenusIds: any = [];


  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, private menuService: MenuService, webCommandService: WebCommandService,
              private permissionService: PermissionService) {
    super(securityService, webCommandService)
    this.tree = new Tree();

    /**
     * 菜单树点击事件 - 重写默认的点击事件
     */
    this.tree.clickTplTreeEvent = (node: NzTreeNode) => {
      try {
        // 获取对应集合下的所有ID
        this.currentClickMenusIds = this.tree.tplTreeNodeIdLs(node);
      } catch (e) {
        // 一般不会出现异常，防止后端程序修改前端报错
      }
      this.permissionTableTitle = "[列表] 所属菜单【" + node.title + "】的权限列表~";
      this.currentClickMenuNode = node.origin;
      this.search(true);
    }
  }

  override ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      menuId: [null, [Validators.required]],
      requestPath: [null, [Validators.required]],
      status: [true, [Validators.required]],
      remarks: [null]
    });

    this.searchTree();
    this.search(true);

  }

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
    if (this.currentClickMenusIds.length > 0) {
      query.menuIdLs = this.currentClickMenusIds.join(",");
    }

    this.nzTableLoading = true;
    const observable: Observable<R> = this.permissionService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }


  /**
   * 查询树结构
   */
  searchTree(): void {
    const query: any = {};
    const observable: Observable<R> = this.menuService.searchAtTree(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.nodes = data.t;
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
      this.validateForm.get('requestPath')?.setValue(obj.requestPath);
      const status = obj.status === 20;
      this.validateForm.get('status')?.setValue(status);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
      this.validateForm.get('menuId')?.setValue(String(obj.menuId));
    } else {
      this.currentAction = this.add;
      if (this.currentClickMenuNode && this.currentClickMenuNode.id) {
        this.validateForm.get("menuId")?.setValue(String(this.currentClickMenuNode.id));
      }
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
      form.code = this.validateForm.get('code')?.value;
      form.menuId = this.validateForm.get('menuId')?.value;
      form.status = this.validateForm.get('status')?.value;
      form.status = form.status ? '20' : '30';
      form.statusExplain = '';
      form.requestPath = P.preText(this.validateForm.get('requestPath')?.value);
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);

      const observable: Observable<R> = this.permissionService.saveAction(form);
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
   * 移除事件
   */
  removeAction(obj?: any): void {
    this.nzTableLoading = true;
    const observable: Observable<R> = this.permissionService.removeAction(obj.id);
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
    this.search();
  }
}
