import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {Pagination} from "../../../starter/utils/pagination";
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {WebCommandService} from "../../../starter/shared/web-command-service";
import {AgentService} from "../../../shared/merchant/agent.service";
import {P, R, U, V} from "../../../starter/utils/utils";
import {Observable} from "rxjs";
import {AgentMarketService} from "../../../shared/merchant/agent-market.service";
import {ProductService} from "../../../shared/mall/product.service";

@Component({
  selector: 'app-agent-market-list',
  templateUrl: './agent-market-list.component.html',
  styleUrls: ['./agent-market-list.component.scss']
})
export class AgentMarketListComponent extends BaseComponent {

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

  // 代理商
  agents: any[] = [];
  // 产品列表
  products: any[] = [];

  // 组件
  elementControls: any[] = [];


  currentProduct: any = {};

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService,
              private agentService: AgentService, private agentMarketService: AgentMarketService,
              private productService: ProductService) {
    super(securityService, webCommandService);
  }

  override ngOnInit(): void {

    this.validateForm = this.fb.group({
      id: [null],
      productId: [null, [Validators.required]],
      agentId: [null, [Validators.required]],
      money: [null, [Validators.required]],
      status: [null, [Validators.required]],
      paymentRegular: [true],
      remarks: [null]
    });

    this.search(true);

    this.searchAgents();
    this.searchProducts();
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
    // 表单数据
    query.searchValue = this.tplSearchValue
    if (!this.tplStatus) {
      // 未选中全部，则显示正常可用的
      query.status = 20;
    }
    this.nzTableLoading = true;
    const observable: Observable<R> = this.agentMarketService.searchAtPage(query);
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
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentAction = this.edit;
      this.validateForm.get('id')?.setValue(obj.id);
      this.validateForm.get('productId')?.setValue(obj.productId);
      this.validateForm.get('agentId')?.setValue(obj.agentId);
      this.validateForm.get('money')?.setValue(obj.money);
      this.validateForm.get('status')?.setValue(obj.status);
      this.validateForm.get('paymentRegular')?.setValue(obj.paymentRegular);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
      this.parseRegular(obj.paymentRegular);
      this.products.forEach((prod) => {
        if (prod.id == obj.productId) {
          this.currentProduct = prod
        }
      })
    } else {
      this.currentAction = this.add;
      this.validateForm.get('status')?.setValue(20);
      this.validateForm.get('productId')?.setValue(this.products[0].id);
      this.changeProductAction(this.validateForm.get('productId')?.value);
      this.calcMoneyAction();
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
      form.productId = this.validateForm.get('productId')?.value;
      form.agentId = this.validateForm.get('agentId')?.value;
      form.money = this.validateForm.get('money')?.value;
      form.status = this.validateForm.get('status')?.value;
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);

      if (U.CollectionUtils.isNotEmpty(this.elementControls)) {
        let elements: any[] = [];
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

      const observable: Observable<R> = this.agentMarketService.saveAction(form);
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
  removeAction(obj: any): void {
    this.nzTableLoading = true;
    const observable: Observable<R> = this.agentMarketService.removeAction(obj.id);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search(true);
      }
    });
  }

  changeProductAction(event: any): void {
    let product: any = undefined;
    this.products.forEach((prod) => {
      if (prod.id == event) {
        product = prod;
      }
    })
    if (!product) {
      this.clearDynamicControl();
      return;
    }
    this.currentProduct = product;
    if (product.payType == 20) {
      this.validateForm.get("paymentRegular")?.setValue(null);
      this.validateForm.get("money")?.setValue(product.money);
      return;
    }
    try {
      this.clearDynamicControl();
      const codeParser: any[] = U.StringUtils.isBank(product.paymentRegular) ? [] : JSON.parse(product.paymentRegular);
      this.parseRegular(JSON.stringify(codeParser));
      this.validateForm.get("paymentRegular")?.setValue(JSON.stringify(codeParser));
    } catch (e) {
      console.log(e)
    }
  }

  onChangeAgentAction(event: any): void {
    // this.validateForm.get("saleRuleId")?.setValue(null);
    //
    // this.findProductSaleRule(this.validateForm.get("productId")?.value, this.validateForm.get('promoterId')?.value);
    //
    // this.changeValidateFormValidators();
  }

  searchAgents(): void {
    const query: any = {};
    const observable: Observable<R> = this.agentService.search(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.agents = data.t;
      }
    });
  }

  searchProducts(): void {
    const query: any = {};
    const observable: Observable<R> = this.productService.search(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.products = data.t;
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
          minValue: c.code,
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
    if (this.currentProduct.payType == 20) {
      return;
    }
    let money = 0;
    this.elementControls.forEach(control => {
      const value = this.validateForm.get('code' + control.id)?.value;
      money = money + Number(value);
    })

    this.validateForm.get("money")?.setValue(money);
  }

  /**
   * 显示数据记录
   */
  override tplCheckedStatus(event: any): void {
    super.tplCheckedStatus(event);
    this.search(true);
  }
}
