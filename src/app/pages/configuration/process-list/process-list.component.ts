import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {Pagination} from "../../../starter/utils/pagination";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {UserService} from "../../../shared/admin/user.service";
import {WorkFlowService} from "../../../shared/worksheet/work-flow.service";
import {P, R, U} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.scss']
})
export class ProcessListComponent extends BaseComponent {
  currentRadioData: any = {};

  // 分页参数
  leftPagination: Pagination = new Pagination();
  // 表格加载标志
  nzLeftTableLoading = false;

  // 分页参数
  rightPagination: Pagination = new Pagination();
  // 表格加载标志
  nzRightTableLoading = false;


  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;
  // 当前操作
  currentAction = this.add;
  // 表单
  validateForm!: UntypedFormGroup;

  // 表单
  validateDetailForm!: UntypedFormGroup;
  // 弹框显示标志
  nzDetailModalVisible = false;
  // 弹框内按钮loading标志
  nzDetailModalBtnLoading = false;


  // 内容人员列表
  users: any[] = [];


  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, private workFlowService: WorkFlowService,
              private userService: UserService, webCommandService: WebCommandService) {
    super(securityService, webCommandService)
  }

  override ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      parentId: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      tasker: [null],
      helper: [null],
      linkWay: [null],
      status: [null, [Validators.required]],
      isMust: [null, [Validators.required]],
      remarks: [null],
      codeParser: [null]

    });

    this.search(true);
    this.searchUserList();
  }

  search(reset: boolean = false): void {
    if (reset) {
      this.leftPagination.reset();
    }
    // 获取基础数据-分页数据
    const query: any = this.leftPagination.query();
    // 表单数据
    query.status = 20
    query.parentId = 0;
    this.nzLeftTableLoading = true;
    const observable: Observable<R> = this.workFlowService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.leftPagination.fill(data);
        if (this.leftPagination.total > 0) {
          if (!this.currentRadioData.id) {
            this.currentRadioData = this.leftPagination.records[0];
          }
        } else {
          this.currentRadioData = {};
        }
        this.searchRight(true);
      }
      this.nzLeftTableLoading = false;
    });
  }


  searchRight(reset: boolean = false): void {
    if (reset) {
      this.rightPagination.reset();
    }
    if (!this.currentRadioData.id) {
      return
    }
    // 获取基础数据-分页数据
    const query: any = this.rightPagination.query();
    // 表单数据
    query.searchValue = this.tplSearchValue;
    if (!this.tplStatus) {
      // 未选中全部，则显示正常可用的
      query.status = 20;
    }
    query.parentId = this.currentRadioData.id;

    this.nzRightTableLoading = true;
    const observable: Observable<R> = this.workFlowService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.rightPagination.fill(data);
      }
      this.nzRightTableLoading = false;
    });
  }

  /**
   * 打开窗口事件
   */
  openLeftViewAction(obj?: any): void {
    this.validateForm.reset();
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentAction = this.edit;
      this.validateForm.get('id')?.setValue(obj.id);
      this.validateForm.get('name')?.setValue(obj.name);
      this.validateForm.get('code')?.setValue(obj.code);
      this.validateForm.get('parentId')?.setValue(obj.parentId);
      this.validateForm.get('priority')?.setValue(obj.priority);
      this.validateForm.get('tasker')?.setValue(obj.tasker);
      this.validateForm.get('helper')?.setValue(obj.helper);
      this.validateForm.get('linkWay')?.setValue(obj.linkWay);
      this.validateForm.get('status')?.setValue(obj.status);
      this.validateForm.get('isMust')?.setValue(obj.isMust);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
    } else {
      this.currentAction = this.add;
      this.validateForm.get('parentId')?.setValue("0");
      this.validateForm.get('priority')?.setValue(1);
      this.validateForm.get('isMust')?.setValue("20");
      this.validateForm.get('status')?.setValue("20");
    }
    this.nzModalVisible = true;
    this.nzModalBtnLoading = false;
  }

  /**
   * 关闭窗口事件
   */
  closeViewAction(): void {
    this.nzModalVisible = false;
    this.validateForm.reset();
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
      form.parentId = this.validateForm.get('parentId')?.value;
      form.priority = this.validateForm.get('priority')?.value;
      form.tasker = P.preText(this.validateForm.get('tasker')?.value);
      form.helper = P.preText(this.validateForm.get('helper')?.value);
      form.linkWay = P.preText(this.validateForm.get('linkWay')?.value);
      form.isMust = this.validateForm.get('isMust')?.value;
      form.status = this.validateForm.get('status')?.value;
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.workFlowService.saveAction(form);
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
  removeAction(obj: any, index: number): void {
    if (index == 0) {
      this.nzLeftTableLoading = true;
    } else {
      this.nzRightTableLoading = true;
    }

    const observable: Observable<R> = this.workFlowService.removeAction(obj);
    observable.subscribe((data) => {
      if (index == 0) {
        this.nzLeftTableLoading = false;
      } else {
        this.nzRightTableLoading = false;
      }

      if (R.isSuccess(data)) {
        this.message.info(data.t);
        if (index == 0) {
          this.currentRadioData = {};
          this.search(true);
        } else {
          this.searchRight(true);
        }
      }
    });
  }

  /**
   * 显示数据记录
   */
  override tplCheckedStatus(event: any): void {
    super.tplCheckedStatus(event);
    this.searchRight(true);
  }


  /**
   * 打开窗口事件
   */
  openDetailViewAction(obj?: any): void {
    this.validateForm.reset();
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentAction = this.edit;
      this.validateForm.get('id')?.setValue(obj.id);
      this.validateForm.get('name')?.setValue(obj.name);
      this.validateForm.get('code')?.setValue(obj.code);
      this.validateForm.get('parentId')?.setValue(obj.parentId);
      this.validateForm.get('priority')?.setValue(obj.priority);
      this.validateForm.get('tasker')?.setValue(P.afterNumberArray(obj.tasker));
      this.validateForm.get('linkWay')?.setValue(obj.linkWay);
      this.validateForm.get('status')?.setValue(obj.status);
      this.validateForm.get('isMust')?.setValue(obj.isMust);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
      this.validateForm.get('helper')?.setValue(P.afterNumberArray(obj.helper));
      this.validateForm.get('codeParser')?.setValue(obj.codeParser);
    } else {
      this.currentAction = this.add;
      this.validateForm.get('parentId')?.setValue(this.currentRadioData.id);
      this.validateForm.get('priority')?.setValue(1);
      this.validateForm.get('isMust')?.setValue(0);
      this.validateForm.get('status')?.setValue(20);
    }

    this.nzDetailModalVisible = true;
    this.nzDetailModalBtnLoading = false;
  }

  /**
   * 关闭窗口事件
   */
  closeDetailViewAction(): void {
    this.nzDetailModalVisible = false;
    this.validateForm.reset();
    this.nzDetailModalBtnLoading = false;
  }

  /**
   * 保存事件
   */
  saveDetailAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.nzDetailModalBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.action = this.currentAction;
      form.id = this.validateForm.get('id')?.value;
      form.name = this.validateForm.get('name')?.value;
      form.code = this.validateForm.get('code')?.value;
      form.parentId = this.validateForm.get('parentId')?.value;
      form.priority = this.validateForm.get('priority')?.value;
      form.tasker = this.validateForm.get('tasker')?.value;
      form.linkWay = P.preText(this.validateForm.get('linkWay')?.value);
      form.isMust = this.validateForm.get('isMust')?.value;
      form.status = this.validateForm.get('status')?.value;
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      form.codeParser = P.preText(this.validateForm.get('codeParser')?.value);
      form.helper = P.preArray(this.validateForm.get('helper')?.value);
      const observable: Observable<R> = this.workFlowService.saveAction(form);
      observable.subscribe((data) => {
        this.nzDetailModalBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.searchRight();
          this.closeDetailViewAction();
        }
      });
    }
  }

  /**
   * 查询用户控件服务
   */
  searchUserList(): void {
    const query: any = {};
    const observable: Observable<R> = this.userService.search(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.users = data.t;
      }
    });
  }


  /**
   * radio 选中测
   */
  changeRadio(event: any, data: any): void {
    if (event) {
      this.currentRadioData = data;
      this.searchRight(true)
    }
  }

}
