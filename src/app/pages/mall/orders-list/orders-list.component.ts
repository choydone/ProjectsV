import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../starter/utils/pagination";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {OrdersService} from "../../../shared/mall/orders.service";
import {AgentService} from "../../../shared/merchant/agent.service";
import {ProductService} from "../../../shared/mall/product.service";
import {P, R, U} from "../../../starter/utils/utils";
import {WebCommandService} from "../../../starter/shared/web-command-service";
import {AgentMarketService} from "../../../shared/merchant/agent-market.service";
import {
  CopyrightAutoConsoleComponent
} from "../../rights/components/copyright-auto-console/copyright-auto-console.component";
import {CopyrightListComponent} from "./components/copyright-list/copyright-list.component";
import {CopyrightConfirmComponent} from "./components/copyright-confirm/copyright-confirm.component";
import {OrdersCapitalListComponent} from "./components/orders-capital-list/orders-capital-list.component";

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent extends BaseComponent {
  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef})
  dynamicComponentContainer?: ViewContainerRef;

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
  // 代理商
  agents: any[] = [];
  // 产品列表
  products: any[] = [];
  currentProduct: any = {};
  // 产品销售价格列表
  agentMarketRule: any = {};
  // 产品销售价格列表
  isModalSpinning = false;

  // 当前处理中的订单
  currentOrders: any = {};


  // 组件
  elements: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService, private ordersService: OrdersService,
              private agentService: AgentService, private productService: ProductService,
              private agentMarketService: AgentMarketService) {
    super(securityService, webCommandService);
  }


  override ngOnInit(): void {
    this.formModel = this.fb.group({
      searchValue: [null],
      productId: [null],
      rangeDate: [null],
      status: [null],
      customer: [null],
      mobile: [null],
      extOrdersNo: [null],
      agentId: [null],
    });


    this.validateForm = this.fb.group({
      id: [null],
      productId: [null, [Validators.required]],
      customer: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      unitMoney: [null, [Validators.required]],
      costMoney: [null],
      discountMoney: [null],
      totalMoney: [null],
      agentId: [null, [Validators.required]],
      agentMarketId: [null, [Validators.required]],
      remarks: [null],
      extOrdersNo: [null],
      isContract: [null, [Validators.required]]
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
    this.getQueryForm(this.formModel.value, query);

    this.nzTableLoading = true;
    const observable: Observable<R> = this.ordersService.searchAtPage(query);
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
  openViewAction(obj?: any): void {
    this.validateForm.reset();
    this.currentProduct = {};
    this.elements = [];
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentOrders = obj;
      this.currentAction = this.edit;
      this.validateForm.get('id')?.setValue(obj.id);
      this.validateForm.get('productId')?.setValue(obj.productId);
      this.validateForm.get('customer')?.setValue(obj.customer);
      this.validateForm.get('mobile')?.setValue(obj.mobile);
      this.validateForm.get('amount')?.setValue(obj.amount);
      this.validateForm.get('unitMoney')?.setValue(obj.unitMoney);
      this.validateForm.get('costMoney')?.setValue(obj.costMoney);
      this.validateForm.get('discountMoney')?.setValue(obj.discountMoney);
      this.validateForm.get('totalMoney')?.setValue(obj.totalMoney);
      this.validateForm.get('agentId')?.setValue(obj.agentId);
      this.validateForm.get('agentMarketId')?.setValue(obj.agentMarketId);
      this.validateForm.get('remarks')?.setValue(obj.remarks);
      this.validateForm.get('extOrdersNo')?.setValue(obj.extOrdersNo);
      this.validateForm.get('isContract')?.setValue(obj.isContract);

    } else {
      this.currentAction = this.add;
      this.validateForm.get('productId')?.setValue(this.products[0].id);
      this.validateForm.get('isContract')?.setValue(0);
      this.validateForm.get('amount')?.setValue(1);


      this.products.forEach((prod) => {
        if (prod.id == this.products[0].id) {
          this.currentProduct = prod
        }
      })
    }
    this.nzModalVisible = true;
    this.nzModalBtnLoading = false;
  }

  /**
   * 关闭窗口事件
   */
  closeViewAction(): void {
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
      form.productId = this.validateForm.get('productId')?.value;
      form.isContract = this.validateForm.get('isContract')?.value;
      form.customer = this.validateForm.get('customer')?.value;
      form.mobile = P.preText(this.validateForm.get('mobile')?.value);
      form.amount = this.validateForm.get('amount')?.value;
      form.unitMoney = this.validateForm.get('unitMoney')?.value;
      form.agentId = this.validateForm.get('agentId')?.value;
      form.agentMarketId = this.validateForm.get('agentMarketId')?.value;
      form.extOrdersNo = P.preText(this.validateForm.get('extOrdersNo')?.value);
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);

      // const regularMap = new Map();
      // try {
      //   let codeParser: any[] = U.StringUtils.isNotBank(this.agentMarketRule.preMoneyRegular) ? JSON.parse(this.agentMarketRule.preMoneyRegular) : [];
      //   codeParser.forEach((c) => {
      //     regularMap.set(c.code, c);
      //   });
      // } catch (e) {
      //   console.debug(e);
      // }
      if(this.currentProduct.payType ==10){
        let data: any[] = [];
        this.elements.forEach((el) => {
          const elValue = this.validateForm.get(el.code)?.value
          let parser: any = {};// regularMap.get(el.code);
          parser.name = el.name;
          parser.value = elValue;
          parser.remarks = el.remarks;
          data = [...data, parser];
          // }
        })
        form.preMoneyRegular = JSON.stringify(data);
      }

      const observable: Observable<R> = this.ordersService.saveAction(form);
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
    const observable: Observable<R> = this.ordersService.removeAction(obj);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search(true);
      }
    });
  }

  /**
   * 产品价格查询
   */
  findProductMoney(productId: any, agentId: any): void {
    if (U.StringUtils.isBank(productId) || U.StringUtils.isBank(agentId)) {
      return
    }
    this.isModalSpinning = true;
    this.agentMarketRule = {};
    // this.baseProductSaleRules = [];
    const query: any = {};
    query.productId = productId;
    query.agentId = agentId;
    const observable: Observable<R> = this.agentMarketService.find(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        if (U.ObjectUtils.isNull(data.t)) {
          this.message.error("代理商对应的产品没有销售方案，请联系管理员查看！");
          this.isModalSpinning = false;
          return;
        }

        this.agentMarketRule = data.t;
        this.validateForm.get("agentMarketId")?.setValue(this.agentMarketRule.id);
        this.validateForm.get("unitMoney")?.setValue(this.agentMarketRule.money);
        this.parseRegular(this.agentMarketRule.paymentRegular);
        this.calcUnitMoneyAction();
      }
      this.isModalSpinning = false;
    });
  }


  /**
   * 导出事件
   */
  exportAction(): void {
    // 获取基础数据-分页数据
    const query: any = {};
    this.getQueryForm(this.formModel.value, query);
    const observable: Observable<R> = this.ordersService.exportAction(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        window.open(data.t, '_blank');
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


  searchAgents(): void {
    const query: any = {};
    const observable: Observable<R> = this.agentService.search(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.agents = data.t;
      }
    });
  }

  onChangeProductOrAgentAction(event: any): void {
    this.validateForm.get("agentMarketId")?.setValue(0);

    this.currentProduct = {};
    this.products.forEach((prod) => {
      if (prod.id == this.validateForm.get("productId")?.value) {
        this.currentProduct = prod
      }
    })

    this.findProductMoney(this.validateForm.get("productId")?.value, this.validateForm.get('agentId')?.value);
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
      codeParser.forEach((c, index) => {
        let control: any = {
          code: "el" + index,
          name: c.name,
          remarks: c.remarks,
          value: c.code,
          minValue: c.code
        };
        this.elements = [...this.elements, control];
        this.validateForm.addControl(
          control.code,
          new UntypedFormControl(control.value, Validators.required)
        );
      })
    } catch (e) {
      console.log(e);
    }
  }

  clearDynamicControl(): void {
    // 清理
    this.elements.forEach(control => {
      this.validateForm.removeControl(control.code);
    })
    this.elements = [];
  }

  calcUnitMoneyAction(): void {
    if (this.currentProduct.payType == 20) {
      return;
    }
    let amount = Number(this.validateForm.get("amount")?.value) || 1;
    let money = 0;
    this.elements.forEach(control => {
      let value = this.validateForm.get(control.code)?.value;
      money = money + Number(value);
    })

    console.log(money)
    this.validateForm.get("unitMoney")?.setValue((money / amount).toFixed(2));
    let totalMoney = amount * Number(this.validateForm.get("unitMoney")?.value);
    // this.validateForm.get("costMoney")?.setValue(this.agentMarketRule.costMoney);
    this.validateForm.get("discountMoney")?.setValue(0);
    this.validateForm.get("totalMoney")?.setValue(totalMoney.toFixed(2));
  }


  calcUnitMoneyAction2(): void {
    if (this.currentProduct.payType == 10) {
      let amount = Number(this.validateForm.get("amount")?.value) || 1;
      let money = 0;
      this.elements.forEach(control => {
        let value = this.validateForm.get(control.code)?.value;
        money = money + Number(value);
      })

      let unitMoney = Number(this.validateForm.get("unitMoney")?.value);
      let oldMultiple = money / unitMoney;
      this.elements.forEach(control => {
        let value = this.validateForm.get(control.code)?.value;
        this.validateForm.get(control.code)?.setValue((Number(value) / oldMultiple) * amount);
      })

      // this.validateForm.get("unitMoney")?.setValue((money / amount).toFixed(2));
      let totalMoney = amount * Number(this.validateForm.get("unitMoney")?.value);
      // this.validateForm.get("costMoney")?.setValue(this.agentMarketRule.costMoney);
      this.validateForm.get("discountMoney")?.setValue(0);
      this.validateForm.get("totalMoney")?.setValue(totalMoney.toFixed(2));
      return;
    }

    this.calcMoneyAction();

  }


  openPreviewViewAction(obj: any): void {
    // 这里可以判断不同类型，选择跳出不同的业务处理窗口

    const component = this.dynamicComponentContainer!.createComponent(CopyrightListComponent);
    // 获取动态组件实例并调用方法
    const dynamicComponentInstance = component.instance as CopyrightListComponent;
    dynamicComponentInstance.openViewAction(obj);
    // 监听关闭事件
    dynamicComponentInstance.closeEvent.subscribe(() => {
      this.dynamicComponentContainer!.remove();
    });
  }

  openConfirmViewAction(obj: any): void {
    // 这里可以判断不同类型，选择跳出不同的业务处理窗口

    const component = this.dynamicComponentContainer!.createComponent(CopyrightConfirmComponent);
    // 获取动态组件实例并调用方法
    const dynamicComponentInstance = component.instance as CopyrightConfirmComponent;
    dynamicComponentInstance.openViewAction(obj);
    // 监听关闭事件
    dynamicComponentInstance.closeEvent.subscribe(() => {
      this.dynamicComponentContainer!.remove();
    });
  }


  openCapitalViewAction(obj: any): void {
    // 这里可以判断不同类型，选择跳出不同的业务处理窗口
    const component = this.dynamicComponentContainer!.createComponent(OrdersCapitalListComponent);
    // 获取动态组件实例并调用方法
    const dynamicComponentInstance = component.instance as OrdersCapitalListComponent;
    dynamicComponentInstance.openViewAction(obj);
    // 监听关闭事件
    dynamicComponentInstance.closeEvent.subscribe(() => {
      this.dynamicComponentContainer!.remove();
    });
  }


  calcMoneyAction(): void {
    if (this.currentProduct.payType == 20) {
      const totalMoney = Number(this.validateForm.get("amount")?.value) * Number(this.validateForm.get("unitMoney")?.value)
      this.validateForm.get("totalMoney")?.setValue(totalMoney);
    }
  }
}
