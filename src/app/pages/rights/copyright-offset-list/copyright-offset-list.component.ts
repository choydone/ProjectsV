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
  selector: 'app-copyright-offset-list',
  templateUrl: './copyright-offset-list.component.html',
  styleUrls: ['./copyright-offset-list.component.scss']
})
export class CopyrightOffsetListComponent extends BaseComponent {

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
    query.statusLs = [22];//软件完成 - 文档制作及申报 - 已申报
    query.extStatusLs = [24];//软件完成 - 文档制作及申报 -补正
    this.nzTableLoading = true;
    const observable: Observable<R> = this.copyrightService.searchAtPage(query);
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
  openViewAction(obj: any): void {
    this.validateForm.reset();
    this.currentCopyright = obj;
    this.validateForm.get('id')?.setValue(obj.id);
    this.validateForm.get('remarks')?.setValue("补正后，重新提交！");
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
