import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../starter/utils/pagination";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {IprService} from "../../../shared/ipr/ipr.service";
import {Observable} from "rxjs";
import {P, R, U} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-ipr-list',
  templateUrl: './ipr-list.component.html',
  styleUrls: ['./ipr-list.component.scss']
})
export class IprListComponent extends BaseComponent {

  isCollapse: boolean = false;
  formModel!: UntypedFormGroup;

  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading: boolean = false;

  // 弹框显示标志
  nzModalVisible: boolean = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading: boolean = false;
  currentIpr: any = {};
  validateForm!: UntypedFormGroup;


  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private iprService: IprService) {
    super(securityService, webCommandService);
  }

  override ngOnInit(): void {
    this.formModel = this.fb.group({
      searchValue: [null],
      certNo: [null],
      customer: [null],
      name: [null],
      author: [null],
      type: [null],
      status: [null],
      rangeDate: [null]
    });

    this.validateForm = this.fb.group({
      id: [null, [Validators.required]],
      docxPath: [null, [Validators.required]],
      remarks: [null]
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
    this.getQueryForm(this.formModel.value, query);
    this.nzTableLoading = true;
    const observable: Observable<R> = this.iprService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }


  removeAction(role: any): void {
    this.nzTableLoading = true;
    const form: any = {};
    form.id = role.id;
    const observable: Observable<R> = this.iprService.removeAction(form);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search();
      }
    });
  }

  /**
   * 打开窗口事件
   */
  openViewAction(obj: any): void {
    this.validateForm.reset();
    this.currentIpr = obj;
    this.validateForm.get('id')?.setValue(obj.id);
    this.nzModalBtnLoading = false;
    this.nzModalVisible = true;
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
      form.id = this.validateForm.get('id')?.value;
      const docxPath: any = P.preText(this.validateForm.get('docxPath')?.value);
      form.docDataLs = [docxPath];
      form.docNameLs = ['补录材料'];
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.iprService.additionalAction(form);
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

  /**
   * 导出事件
   */
  exportAction(): void {
    // 获取基础数据-分页数据
    const query: any = {};
    this.getQueryForm(this.formModel.value, query);
    const observable: Observable<R> = this.iprService.exportAction(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        window.open(data.t, '_blank');
      }
    });
  }

  isShowDocIcon(obj: any): boolean {
    const logback: any = obj.docData;
    return !U.StringUtils.isBank(logback);
  }


}
