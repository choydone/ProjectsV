import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../starter/utils/pagination";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {P, R, U} from "../../../starter/utils/utils";
import {ContractService} from "../../../shared/acc/contract.service";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-orders-contract-list',
  templateUrl: './orders-contract-list.component.html',
  styleUrls: ['./orders-contract-list.component.scss']
})
export class OrdersContractListComponent extends BaseComponent {
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
  validateForm!: UntypedFormGroup;
  currentAction = this.add;
  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService, private contractService: ContractService) {
    super(securityService, webCommandService);
  }


  override ngOnInit(): void {
    this.formModel = this.fb.group({
      searchValue: [null],
      customer: [null],
      name: [null],
      status: [null],
      signingDate: [null],
      originType: [null],
      originId: [null]
    });

    this.validateForm = this.fb.group({
      id: [null],
      customer: [null, [Validators.required]],
      name: [null, [Validators.required]],
      signingDate: [null, [Validators.required]],
      content: [null],
      paymentTerms: [null],
      breakTerms: [null],
      status: [null, [Validators.required]],
      docData: [null]
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
    query.originType = 10;
    this.nzTableLoading = true;
    const observable: Observable<R> = this.contractService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }

  /**
   * 打开界面
   */
  openViewAction(obj: any): void {
    this.validateForm.reset();
    this.currentAction = this.edit;
    this.validateForm.get('id')?.setValue(obj.id);
    this.validateForm.get('status')?.setValue(obj.status);
    this.validateForm.get('customer')?.setValue(obj.customer);
    this.validateForm.get('name')?.setValue(obj.name);
    this.validateForm.get('signingDate')?.setValue(obj.signingDate);
    this.validateForm.get('content')?.setValue(obj.content);
    this.validateForm.get('paymentTerms')?.setValue(obj.paymentTerms);
    this.validateForm.get('breakTerms')?.setValue(obj.breakTerms);
    this.listOfControl = [];
    if (U.StringUtils.isNotBank(obj.data)) {
      let data: any[] = JSON.parse(obj.data);
      data.forEach((d) => {
        const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
        const control = {
          id,
          controlInstance: d.name
        };
        const index = this.listOfControl.push(control);
        this.validateForm.addControl(
          this.listOfControl[index - 1].controlInstance,
          new UntypedFormControl(d.text)
        );
      })
    }

    if (this.validateForm.get("docData")?.value == 20) {
      this.validateForm.get("docData")?.addValidators(Validators.required)
    } else {
      this.validateForm.get("docData")?.removeValidators(Validators.required)
    }

    this.nzModalVisible = true;
    this.nzModalBtnLoading = false;
  }

  /**
   * 关闭窗口事件
   */
  closeViewAction(): void {
    let len = this.listOfControl.length;
    for (let i = 0; i < len; i++) {
      const control = this.listOfControl[i];
      this.validateForm.removeControl(control.controlInstance);
    }
    this.listOfControl = [];
    this.nzModalVisible = false;
    this.nzModalBtnLoading = false;
    this.validateForm.reset();
  }

  /**
   * 保存事件
   */
  saveAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls
      ) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      this.nzModalBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.action = this.currentAction;
      form.id = this.validateForm.get('id')?.value;
      form.status = this.validateForm.get('status')?.value;
      form.customer = this.validateForm.get('customer')?.value;
      form.name = this.validateForm.get('name')?.value;
      form.signingDate = P.formatDate(this.validateForm.get('signingDate')?.value);
      form.content = P.preText(this.validateForm.get('content')?.value);
      form.paymentTerms = P.preText(this.validateForm.get('paymentTerms')?.value);
      form.breakTerms = P.preText(this.validateForm.get('breakTerms')?.value);
      form.data = P.preText(this.validateForm.get('data')?.value);
      form.docData = P.preText(this.validateForm.get('docData')?.value);
      let len = this.listOfControl.length;
      let data: any[] = [];
      for (let i = 0; i < len; i++) {
        data = [...data, {
          name: 'remark' + i,
          text: P.preText(this.validateForm.get('remark' + i)?.value)
        }]
      }
      form.data = JSON.stringify(data);
      const observable: Observable<R> = this.contractService.saveAction(form);
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

  removeAction(obj: any): void {
    this.nzTableLoading = true;
    const observable: Observable<R> = this.contractService.removeAction(obj);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search(true);
      }
    });
  }


  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
    const control = {
      id,
      controlInstance: `remark${id}`
    };
    const index = this.listOfControl.push(control);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new UntypedFormControl(null)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 0) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  changeStatusAction(event: any): void {
    if (event == 20) {
      this.validateForm.get("docData")?.addValidators(Validators.required)
    } else {
      this.validateForm.get("docData")?.removeValidators(Validators.required)
    }
  }
}
