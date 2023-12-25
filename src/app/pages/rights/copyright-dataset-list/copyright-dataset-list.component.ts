import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../starter/utils/pagination";
import {BaseComponent} from "../../base.component";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {CopyrightService} from "../../../shared/ipr/copyright.service";
import {R, U} from "../../../starter/utils/utils";
import {ElementDatasetComponent} from "./components/element-dataset/element-dataset.component";
import {DocxDatasetComponent} from "./components/docx-dataset/docx-dataset.component";
import {KernelDatasetComponent} from "./components/kernel-dataset/kernel-dataset.component";
import {CopyrightAutoConsoleComponent} from "../components/copyright-auto-console/copyright-auto-console.component";
import {WebCommandService} from "../../../starter/shared/web-command-service";
import {AutoDatasetComponent} from "./components/auto-dataset/auto-dataset.component";

@Component({
  selector: 'app-copyright-list',
  templateUrl: './copyright-dataset-list.component.html',
  styleUrls: ['./copyright-dataset-list.component.scss']
})
export class CopyrightDatasetListComponent extends BaseComponent {
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
  currentOrdersCopyright: any = {};

  @ViewChild("elementDatasetComponent")
  elementDatasetComponent?: ElementDatasetComponent;
  @ViewChild("docxDatasetComponent")
  docxDatasetComponent?: DocxDatasetComponent;
  @ViewChild("kernelDatasetComponent")
  kernelDatasetComponent?: KernelDatasetComponent;
  // 数据配置栏目的索引
  index = 0;
  // 当前的软著数据，点击过程实时在刷新
  currentCopyrightDataset: any = {};
  steps: any = {"kernelStep": 0, "docxStep": 0, "elementStep": 0};

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
    query.statusLs = [10, 11];//待接收-软件制作中
    this.nzTableLoading = true;
    const observable: Observable<R> = this.copyrightService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }

  acceptedAction(obj: any): void {
    const form: any = {};
    form.id = obj.id
    const observable: Observable<R> = this.copyrightService.acceptedAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t)
        this.search()
      }
    });
  }

  processedAction(obj: any, remarks: any): void {
    const form: any = {};
    form.id = obj.id;
    form.remarks = remarks;
    const observable: Observable<R> = this.copyrightService.processedAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t)
        this.search()
      }
    });
  }

  closeViewAction(): void {
    this.nzModalVisible = false;
    this.currentCopyrightDataset = {};
    this.currentOrdersCopyright = {};
  }

  /**
   *  订单确认操作
   */
  openViewAction(obj: any): void {
    this.steps = {"kernelStep": 0, "docxStep": 0, "elementStep": 0};
    const observable: Observable<R> = this.copyrightService.getById(obj.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.currentCopyrightDataset = data.t;
        this.currentCopyrightDataset.customer = obj.customer;
        if (U.StringUtils.isNotBank(this.currentCopyrightDataset.codeup)) {
          const codeup: any = JSON.parse(this.currentCopyrightDataset.codeup);
          this.steps.kernelStep = U.ObjectUtils.nonNull(codeup.kernelStep) ? codeup.kernelStep : 0;
          this.steps.docxStep = U.ObjectUtils.nonNull(codeup.docxStep) ? codeup.docxStep : 0;
          this.steps.elementStep = U.ObjectUtils.nonNull(codeup.elementStep) ? codeup.elementStep : 0;
        }
        this.nzModalVisible = true;
        this.onIndexChange(0);
      }
    });
  }


  openPreviewViewAction(obj: any): void {
    const observable: Observable<R> = this.copyrightService.getById(obj.id);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        let currentDataset: any = data.t;
        currentDataset.customer = obj.customer;
        const component = this.previewDynamicComponentContainer!.createComponent(CopyrightAutoConsoleComponent);
        // 获取动态组件实例并调用方法
        const dynamicComponentInstance = component.instance as CopyrightAutoConsoleComponent;
        dynamicComponentInstance.openViewAction(currentDataset);
        // 监听关闭事件
        dynamicComponentInstance.closeEvent.subscribe(() => {
          this.previewDynamicComponentContainer!.remove();
        });
      }
    });
  }

  openAutoViewAction(obj: any): void {
    const component = this.previewDynamicComponentContainer!.createComponent(AutoDatasetComponent);
    // 获取动态组件实例并调用方法
    const dynamicComponentInstance = component.instance as AutoDatasetComponent;
    dynamicComponentInstance.openViewAction(obj);
    // 监听关闭事件
    dynamicComponentInstance.closeEvent.subscribe(() => {
      this.previewDynamicComponentContainer!.remove();
    });
  }

  onIndexChange(event: number): void {
    this.index = event;
    if (event == 0) {
      setTimeout(() => {
        this.kernelDatasetComponent?.loadViewDataAction(this.currentCopyrightDataset);
      }, 10)
      return
    }
    if (event == 1) {
      setTimeout(() => {
        this.docxDatasetComponent?.loadViewDataAction(this.currentCopyrightDataset);
      }, 10)
      return
    }
    if (event == 2) {
      setTimeout(() => {
        this.elementDatasetComponent?.loadViewDataAction(this.currentCopyrightDataset);
      }, 10)
      return
    }
    this.message.error("不应该出现的bug，请联系管理员！");
  }

  refreshCopyrightDatasetAction(event: any): void {
    console.log(event)
    //  将修改的数据替换回到上级页面缓存数据，在触发时内部已经保存到数据库了。
    let codeup: any = JSON.parse(this.currentCopyrightDataset.codeup);
    Object.assign(codeup, JSON.parse(event.codeup));
    this.currentCopyrightDataset.codeup = JSON.stringify(codeup);
    if (U.StringUtils.isNotBank(this.currentCopyrightDataset.codeup)) {
      // const codeup: any = JSON.parse(this.currentCopyrightDataset.codeup);
      // console.log(codeup)
      this.steps.kernelStep = U.ObjectUtils.nonNull(codeup.kernelStep) ? codeup.kernelStep : 0;
      this.steps.docxStep = U.ObjectUtils.nonNull(codeup.docxStep) ? codeup.docxStep : 0;
      this.steps.elementStep = U.ObjectUtils.nonNull(codeup.elementStep) ? codeup.elementStep : 0;
    }

  }
}
