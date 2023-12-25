import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {Pagination} from "../../../starter/utils/pagination";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {CodeDesignService} from "../../../shared/admin/code-design.service";
import {P, R, U} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-dict-list',
  templateUrl: './code-design-list.component.html',
  styleUrls: ['./code-design-list.component.scss']
})
export class CodeDesignListComponent extends BaseComponent {

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
  // 权限表单
  validateForm!: UntypedFormGroup;


  // 表单
  validateRightForm!: UntypedFormGroup;
  // 弹框显示标志
  nzRightModalVisible = false;
  // 弹框内按钮loading标志
  nzRightModalBtnLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private codeDesignService: CodeDesignService) {
    super(securityService, webCommandService)
  }

  override ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      remarks: [null]
    });

    this.validateRightForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      codeParser: [null, [Validators.required]],
      parentId: [null, [Validators.required]],
      status: [20, [Validators.required]],
      remarks: [null]
    });

    this.search(true);
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
    const observable: Observable<R> = this.codeDesignService.searchAtPage(query);
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
      this.rightPagination.reset();
      return;
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
    const observable: Observable<R> = this.codeDesignService.searchAtPage(query);
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
      this.validateForm.get('remarks')?.setValue(obj.remarks);
    } else {
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
      form.name = this.validateForm.get('name')?.value;
      form.code = this.validateForm.get('code')?.value;
      form.codeParser = "";
      form.sorter = 100;
      form.status = 20;
      form.parentId = 0;
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.codeDesignService.saveAction(form);
      observable.subscribe((data) => {
        this.nzModalBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.currentRadioData.name = form.name;
          this.currentRadioData.code = form.code;
          this.currentRadioData.remarks = form.remarks;
          this.search();
          this.closeViewAction();
        }
      });
    }
  }

  /**
   * 移除事件
   */
  removeLeftAction(obj: any): void {
    this.nzLeftTableLoading = true;
    const observable: Observable<R> = this.codeDesignService.removeAction(obj);
    observable.subscribe((data) => {
      this.nzLeftTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.currentRadioData = {};
        this.search(true);
      }
    });
  }

  removeRightAction(obj: any): void {
    this.nzRightTableLoading = true;
    const observable: Observable<R> = this.codeDesignService.removeAction(obj);
    observable.subscribe((data) => {
      this.nzRightTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.searchRight(true);
      }
    });
  }

  /**
   * 打开窗口事件
   */
  openRightViewAction(obj?: any): void {
    this.validateRightForm.reset();
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentAction = this.edit;
      this.validateRightForm.get('id')?.setValue(obj.id);
      this.validateRightForm.get('name')?.setValue(obj.name);
      this.validateRightForm.get('code')?.setValue(obj.code);
      this.validateRightForm.get('codeParser')?.setValue(obj.codeParser);
      // this.validateRightForm.get('sorter')?.setValue(obj.sorter);
      this.validateRightForm.get('status')?.setValue(obj.status);
      this.validateRightForm.get('remarks')?.setValue(obj.remarks);
      this.validateRightForm.get('parentId')?.setValue(obj.parentId);
    } else {
      this.currentAction = this.add;
      this.validateRightForm.get('status')?.setValue(20);
      this.validateRightForm.get('parentId')?.setValue(this.currentRadioData.id);
    }
    this.nzRightModalBtnLoading = false;
    this.nzRightModalVisible = true;
  }

  closeRightViewAction(): void {
    this.validateRightForm.reset();
    this.nzRightModalVisible = false;
    this.nzRightModalBtnLoading = false;
  }

  saveRightAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateRightForm.controls) {
      this.validateRightForm.controls[i].markAsDirty();
      this.validateRightForm.controls[i].updateValueAndValidity();
    }
    if (this.validateRightForm.valid) {
      this.nzRightModalBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.action = this.currentAction;
      form.id = this.validateRightForm.get('id')?.value;
      form.name = this.validateRightForm.get('name')?.value;
      form.code = this.validateRightForm.get('code')?.value;
      form.codeParser = P.preText(this.validateRightForm.get('codeParser')?.value);
      form.sorter = 100;
      form.status = this.validateRightForm.get('status')?.value;
      form.parentId = this.validateRightForm.get('parentId')?.value;
      form.remarks = P.preText(this.validateRightForm.get('remarks')?.value);
      const observable: Observable<R> = this.codeDesignService.saveAction(form);
      observable.subscribe((data) => {
        this.nzRightModalBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.searchRight();
          this.closeRightViewAction();
        }
      });
    }
  }

  /**
   * 显示数据记录
   */
  override tplCheckedStatus(event: any): void {
    super.tplCheckedStatus(event);
    this.searchRight(true);
  }

  /**
   * dictionary-radio 选中测
   */
  changeRadio(event: any, data: any): void {
    if (event) {
      this.currentRadioData = data;
      this.searchRight(true)
    }
  }

}
