import {Component, OnInit} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {BaseComponent} from "../../base.component";
import {Etable} from "../../../starter/elements/table/etable";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {MenuService} from "../../../shared/admin/menu.service";
import {Pagination} from "../../../starter/utils/pagination";
import {SecurityService} from "../../../starter/shared/security-service";
import {P, R, U} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent extends BaseComponent {

  searchValue = '';
  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading = false;
  etable!: Etable;

  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;
  // 当前操作
  currentAction = this.add;
  validateForm!: UntypedFormGroup;

  parentValue?: string;
  nodes = [];

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService, private menuService: MenuService) {
    super(securityService,webCommandService);
    this.etable = new Etable();
  }

  override ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      icon: [null, [Validators.required]],
      parentId: [0, [Validators.required]],
      mark: [null],
      routePath: [null, [Validators.required]],
      sorter: [true, [Validators.required]],
      isVisible: [true, [Validators.required]],
      type: [true, [Validators.required]],
      status: [true, [Validators.required]],
      remarks: [null]
    });

    this.search(true);

    this.searchTree();
  }

  search(reset: boolean = false): void {
    if (reset) {
      this.pagination.reset();
    }
    const query: any = this.pagination.query();
    // 表单数据
    query.searchValue = this.tplSearchValue
    if (!this.tplStatus) {
      // 未选中全部，则显示正常可用的
      query.status = 20;
    }
    this.nzTableLoading = true;
    const observable: Observable<R> = this.menuService.searchAtPageAndTree(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
        this.etable.initData(this.pagination.records);
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
  openSubViewAction(obj?: any): void {
    this.validateForm.reset();
    this.currentAction = this.add;
    this.parentValue = String(obj.id);
    this.validateForm.get('parentId')?.setValue(obj.parentId);
    this.validateForm.get('sorter')?.setValue(100);
    this.validateForm.get('status')?.setValue(true);
    this.validateForm.get('isVisible')?.setValue(true);
    this.validateForm.get('type')?.setValue("10");
    this.nzModalVisible = true;
    this.nzModalBtnLoading = false;
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
      this.validateForm.get('icon')?.setValue(obj.icon);
      this.validateForm.get('parentId')?.setValue(obj.parentId);
      this.parentValue = String(obj.parentId);
      this.validateForm.get('mark')?.setValue(obj.mark);
      const status = obj.status === 20;
      this.validateForm.get('status')?.setValue(status);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
      const isVisible = obj.isVisible === 20;
      this.validateForm.get('isVisible')?.setValue(isVisible);
      this.validateForm.get('routePath')?.setValue(obj.routePath);
      this.validateForm.get('sorter')?.setValue(obj.sorter);
      this.validateForm.get('type')?.setValue(String(obj.type));
    } else {
      this.currentAction = this.add;
      this.validateForm.get('sorter')?.setValue(100);
      this.validateForm.get('status')?.setValue(true);
      this.validateForm.get('isVisible')?.setValue(true);
      this.validateForm.get('type')?.setValue("10");
      this.parentValue = String(0);
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
    this.parentValue = this.parentValue ? this.parentValue : "0";
    this.validateForm.get('parentId')?.setValue(this.parentValue);

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
      form.icon = this.validateForm.get('icon')?.value;
      form.parentId = this.validateForm.get('parentId')?.value;
      form.status = this.validateForm.get('status')?.value;
      form.status = form.status ? '20' : '30';
      form.statusExplain = '';
      form.sorter = this.validateForm.get('sorter')?.value;
      form.isVisible = this.validateForm.get('isVisible')?.value;
      form.isVisible = form.isVisible ? '20' : '30';
      form.type = this.validateForm.get('type')?.value;
      form.routePath = P.preText(this.validateForm.get('routePath')?.value);
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.menuService.saveAction(form);
      observable.subscribe((data) => {
        this.nzModalBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.search();
          this.searchTree();
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
    const observable: Observable<R> = this.menuService.removeAction(obj.id);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search(true);
        this.searchTree();
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
