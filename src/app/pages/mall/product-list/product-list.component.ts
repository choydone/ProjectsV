import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {Pagination} from "../../../starter/utils/pagination";
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {WebCommandService} from "../../../starter/shared/web-command-service";
import {Observable} from "rxjs";
import {P, R, U} from "../../../starter/utils/utils";
import {ProductService} from "../../../shared/mall/product.service";

@Component({
  selector: 'app-project-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends BaseComponent {

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

  // 组件
  elementControls: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private productService: ProductService) {
    super(securityService, webCommandService);
  }

  override ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      status: [20, [Validators.required]],
      money: [null, [Validators.required]],
      payType: [null, [Validators.required]],
      paymentRegular: [null],
      remarks: [null]
    });

    this.search(true)
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
    const observable: Observable<R> = this.productService.searchAtPage(query);
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
  openViewAction(obj?: any): void {
    this.validateForm.reset();
    // 清理
    this.clearDynamicControl();
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentAction = this.edit;
      this.validateForm.get('id')?.setValue(obj.id);
      this.validateForm.get('name')?.setValue(obj.name);
      this.validateForm.get('code')?.setValue(obj.code);
      this.validateForm.get('status')?.setValue(obj.status);
      this.validateForm.get('payType')?.setValue(obj.payType);
      this.validateForm.get('money')?.setValue(obj.money);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
      this.validateForm.get('paymentRegular')?.setValue(obj.paymentRegular);
      this.parseRegular(obj.paymentRegular);
    } else {
      this.currentAction = this.add;
      this.validateForm.get('status')?.setValue(20);
      this.validateForm.get('payType')?.setValue(20);
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
      form.status = this.validateForm.get('status')?.value;
      form.payType = this.validateForm.get('payType')?.value;
      form.money = this.validateForm.get('money')?.value;
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);

      let elements: any[] = [];
      if (form.payType == 10 ) {
        if(U.CollectionUtils.isEmpty( this.elementControls)){
          this.message.warning("付款方式为分段收款时，收款规则不能为空列表！")
          this.nzModalBtnLoading = false;
          return;
        }
        let money = 0
        this.elementControls.forEach((elementControl: any) => {
          const name = this.validateForm.get('name' + elementControl.id)?.value;
          const code = this.validateForm.get('code' + elementControl.id)?.value;
          const remarks = this.validateForm.get('remarks' + elementControl.id)?.value;
          let element: any = {};
          element.name = name;
          element.code = code;
          element.remarks = remarks;
          elements = [...elements, element];

          money = money + Number(code)
        })
        form.paymentRegular = JSON.stringify(elements);
        if (money !== form.money) {
          this.message.warning("付款方式为分段收款时，收款的总金额必须等于基础价格！")
          this.nzModalBtnLoading = false;
          return;
        }
      }

      const observable: Observable<R> = this.productService.saveAction(form);
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
   * 删除事件
   */
  removeAction(role: any): void {
    this.nzTableLoading = true;
    const form: any = {};
    form.id = role.id;
    const observable: Observable<R> = this.productService.removeAction(form);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search();
      }
    });
  }


  parseRegular(codeParserString: string): void {
    try {
      // 清理
      this.clearDynamicControl();
      if (U.StringUtils.isBank(codeParserString)) {
        return
      }

      const codeParser: any[] = JSON.parse(codeParserString);
      // 这里动态添加组件
      codeParser.forEach((c) => {
        const id = this.elementControls.length > 0 ? this.elementControls[this.elementControls.length - 1].id + 1 : 0;
        let nameControl: any = {
          controlInstance: `name${id}`
        };
        let codeControl: any = {
          controlInstance: `code${id}`
        };
        let remarksControl: any = {
          controlInstance: `remarks${id}`
        };

        let elements: any[] = [];
        elements = [...elements, nameControl];
        elements = [...elements, codeControl];
        elements = [...elements, remarksControl];

        const control = {
          id,
          elements: elements
        };

        const index = this.elementControls.push(control);
        this.validateForm.addControl(
          nameControl.controlInstance,
          new UntypedFormControl(c.name, Validators.required)
        );
        this.validateForm.addControl(
          codeControl.controlInstance,
          new UntypedFormControl(c.code, Validators.required)
        );
        this.validateForm.addControl(
          remarksControl.controlInstance,
          new UntypedFormControl(c.remarks, Validators.required)
        );
      })
    } catch (e) {
      console.log(e);
    }
  }

  clearDynamicControl(): void {
    // 清理
    this.elementControls.forEach(elementControl => {
      this.validateForm.removeControl('name' + elementControl.id);
      this.validateForm.removeControl('code' + elementControl.id);
      this.validateForm.removeControl('remarks' + elementControl.id);
    })
    this.elementControls = [];
  }


  calcMoneyAction(): void {
    let money = 0;
    this.elementControls.forEach(control => {
      const value=this.validateForm.get('code'+control.id)?.value;
      money = money + Number(value);
    })

    this.validateForm.get("money")?.setValue(money);
  }


  addPayRegularField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    const id = this.elementControls.length > 0 ? this.elementControls[this.elementControls.length - 1].id + 1 : 0;


    const nameControl = {
      controlInstance: `name${id}`
    };
    const codeControl = {
      controlInstance: `code${id}`
    };
    const remarksControl = {
      controlInstance: `remarks${id}`
    };
    let elements: any[] = [];
    elements = [...elements, nameControl];
    elements = [...elements, codeControl];
    elements = [...elements, remarksControl];

    const control = {
      id,
      elements: elements
    };

    const index = this.elementControls.push(control);

    elements.forEach((el) => {
      this.validateForm.addControl(
        el.controlInstance,
        new UntypedFormControl(null, Validators.required)
      );
    })

  }

  removePayRegularField(control: any, e: MouseEvent): void {
    if (U.CollectionUtils.isNotEmpty(this.elementControls)) {
      const index = this.elementControls.indexOf(control);
      this.elementControls.splice(index, 1);
      this.validateForm.removeControl('name' + control.id);
      this.validateForm.removeControl('code' + control.id);
      this.validateForm.removeControl('remarks' + control.id);
    }

    this.calcMoneyAction();
  }

  /**
   * 显示数据记录
   */
  override tplCheckedStatus(event: any): void {
    super.tplCheckedStatus(event);
    this.search(true);
  }


}

