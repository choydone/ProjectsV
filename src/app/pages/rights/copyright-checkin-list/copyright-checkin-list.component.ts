import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../starter/utils/pagination";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {CopyrightService} from "../../../shared/ipr/copyright.service";
import {Observable} from "rxjs";
import {P, R, U} from "../../../starter/utils/utils";
import {CopyrightAutoDocxComponent} from "../components/copyright-auto-docx/copyright-auto-docx.component";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-copyright-reported-list',
  templateUrl: './copyright-checkin-list.component.html',
  styleUrls: ['./copyright-checkin-list.component.scss']
})
export class CopyrightCheckinListComponent extends BaseComponent {

  @ViewChild('previewDynamicComponentContainer', {read: ViewContainerRef})
  previewDynamicComponentContainer?: ViewContainerRef;


  isCollapse = false;
  formModel!: UntypedFormGroup;

  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading = false;

  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;
  currentCopyright: any = {};
  validateForm!: UntypedFormGroup;

  // 登记版权中心数据
  nzModalCopyrightVisible = false;
  // 弹框内按钮loading标志
  nzModalCopyrightBtnLoading = false;
  validateCopyrightForm!: UntypedFormGroup;

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService, private copyrightService: CopyrightService) {
    super(securityService, webCommandService);
  }

  override ngOnInit(): void {
    this.formModel = this.fb.group({
      searchValue: [null],
      name: [null],
      author: [null],
      status: [null]
    });


    this.validateCopyrightForm = this.fb.group({
      id: [null, [Validators.required]],
      extStatus: [null, [Validators.required]],
      copyrightPath: [null],
      remarks: [null]
    });


    this.validateForm = this.fb.group({
      id: [null, [Validators.required]],
      docxPath: [null, [Validators.required]],
      codePath: [null, [Validators.required]],
      featurePath: [null, [Validators.required]],
      putinPath: [null, [Validators.required]],
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
    query.statusLs = [12, 14, 22];//软件完成 - 文档制作及申报 - 已申报
    this.nzTableLoading = true;
    const observable: Observable<R> = this.copyrightService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }

  preDeclaredAction(obj: any): void {
    const form: any = {};
    form.id = obj.id
    const observable: Observable<R> = this.copyrightService.preDeclaredAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t)
        this.search()
      }
    });
  }

  /**
   * 打开窗口事件
   */
  openViewAction(obj: any): void {
    this.validateForm.reset();
    this.currentCopyright = obj;
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
      const codePath: any = P.preText(this.validateForm.get('codePath')?.value);
      const featurePath: any = P.preText(this.validateForm.get('featurePath')?.value);
      const putinPath: any = P.preText(this.validateForm.get('putinPath')?.value);
      form.docDataLs = [docxPath, codePath, featurePath, putinPath];
      form.docNameLs = ['使用说明书', '源代码', '软件特色', '申请书'];
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.copyrightService.declaredAction(form);
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

  openCopyrightViewAction(obj: any): void {
    this.validateCopyrightForm.reset();
    this.currentCopyright = obj;
    this.validateCopyrightForm.get('id')?.setValue(obj.id);
    this.validateCopyrightForm.get('extStatus')?.setValue(obj.extStatus);
    this.changeExtStatusAction(obj.extStatus);
    this.nzModalCopyrightBtnLoading = false;
    this.nzModalCopyrightVisible = true;
  }

  saveCopyrightAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateCopyrightForm.controls) {
      this.validateCopyrightForm.controls[i].markAsDirty();
      this.validateCopyrightForm.controls[i].updateValueAndValidity();
    }

    if (this.validateCopyrightForm.valid) {
      this.nzModalCopyrightBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.id = this.validateCopyrightForm.get('id')?.value;
      form.extStatus = this.validateCopyrightForm.get('extStatus')?.value;
      const copyrightPath: any = P.preText(this.validateCopyrightForm.get('copyrightPath')?.value);
      if (U.StringUtils.isNotBank(copyrightPath)) {
        form.docData = copyrightPath;
      }
      form.remarks = P.preText(this.validateCopyrightForm.get('remarks')?.value);
      const observable: Observable<R> = this.copyrightService.updateCopyrightStatusAction(form);
      observable.subscribe((data) => {
        this.nzModalCopyrightBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.search();
          this.closeCopyrightViewAction();
        }
      });
    }
  }

  closeCopyrightViewAction(): void {
    this.validateCopyrightForm.reset();
    this.nzModalCopyrightVisible = false;
    this.nzModalCopyrightBtnLoading = false;
  }

  changeExtStatusAction(event: any): void {
    if (event == 24 || event == 20) {
      this.validateCopyrightForm.get("copyrightPath")?.addValidators(Validators.required);
    } else {
      this.validateCopyrightForm.get("copyrightPath")?.removeValidators(Validators.required);
    }
  }

  isShowDocIcon(obj: any): boolean {
    const logback: any = obj.docData;
    return !U.StringUtils.isBank(logback);
  }


  openDocxMakeAction(obj: any): void {
    const observable: Observable<R> = this.copyrightService.getById(obj.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        let currentDataset: any = data.t;
        currentDataset.customer = obj.customer;
        const component = this.previewDynamicComponentContainer!.createComponent(CopyrightAutoDocxComponent);
        // 获取动态组件实例并调用方法
        const dynamicComponentInstance = component.instance as CopyrightAutoDocxComponent;
        dynamicComponentInstance.openViewAction(currentDataset);
        // 监听关闭事件
        dynamicComponentInstance.closeEvent.subscribe(() => {
          this.previewDynamicComponentContainer!.remove();
        });
      }
    });
  }


}
