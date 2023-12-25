import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, UntypedFormGroup} from "@angular/forms";
import {BaseComponent} from "../../../../base.component";
import {Observable} from "rxjs";
import {R, U} from "../../../../../starter/utils/utils";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../../../starter/shared/security-service";
import {OrdersService} from "../../../../../shared/mall/orders.service";
import {AgentService} from "../../../../../shared/merchant/agent.service";
import {ProductService} from "../../../../../shared/mall/product.service";
import {OrdersCopyrightService} from "../../../../../shared/mall/orders-copyright.service";
import {WebCommandService} from "../../../../../starter/shared/web-command-service";

@Component({
  selector: 'app-copyright-confirm',
  templateUrl: './copyright-confirm.component.html',
  styleUrls: ['./copyright-confirm.component.scss']
})
export class CopyrightConfirmComponent extends BaseComponent {
  @Output() searchEvent = new EventEmitter();
  @Output() closeEvent = new EventEmitter<void>();

  /* 订单确认操作 */
  nzModalConfirmVisible = false
  nzModalConfirmBtnLoading = false;
  validateConfirmForm!: UntypedFormGroup;
  // 表格加载标志
  nzTableConfirmLoading = false;

  // 当前处理中的订单
  currentOrders: any = {};

  // 订单对应的软著明细
  ordersCopyrights: any[] = [];

  editCache: any = {};

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, private ordersService: OrdersService,
              private agentService: AgentService, private productService: ProductService,
              private ordersCopyrightService: OrdersCopyrightService, webCommandService: WebCommandService) {
    super(securityService, webCommandService);
    this.validateConfirmForm = this.fb.group({
      id: [null],
      productId: [null],
      customer: [null],
      mobile: [null],
      amount: [null],
      unitPrice: [null],
      totalPrice: [null],
      remarks: [null],
      extOrdersNo: [null],
    });
  }


  override ngOnInit(): void {


  }


  searchOrdersCopyright(id: any): void {
    this.nzTableConfirmLoading = true;
    this.ordersCopyrights = []
    let query: any = {};
    query.ordersId = id;
    const observable: Observable<R> = this.ordersCopyrightService.search(query);
    observable.subscribe((data) => {
      this.nzTableConfirmLoading = false;
      if (R.isSuccess(data)) {
        this.ordersCopyrights = data.t;
      }
    });
  }


  /**
   *  订单确认操作
   */
  openViewAction(obj: any): void {
    console.log(this.validateConfirmForm)
    this.validateConfirmForm.reset();
    this.currentOrders = obj;
    this.nzModalConfirmVisible = true;
    this.nzModalConfirmBtnLoading = false;

    // 查询对应的订单明细数据
    this.searchOrdersCopyright(obj.id);
  }

  closeConfirmViewAction(): void {
    this.nzModalConfirmVisible = false;
    this.nzModalConfirmBtnLoading = false;
    this.validateConfirmForm.reset();
    this.closeEvent.emit();
  }

  saveConfirmAction(): void {
    if (Object.keys(this.editCache).length > 0) {
      this.message.info("还有未保存的软件记录信息,无法提交订单确认！")
      return;
    }
    if (this.currentOrders.amount != this.ordersCopyrights.length) {
      this.message.info("订单软件数量与实际记录的软件数不符,无法提交订单确认")
      return;
    }

    let form: any = {};
    form.id = this.currentOrders.id;
    const observable: Observable<R> = this.ordersService.copyrightConfirmedAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.closeConfirmViewAction();
        // 调用父页面的查询接口刷新数据
        this.searchEvent.emit();
      }
    });
  }

  addCopyrightAction(): void {
    if (this.ordersCopyrights.length >= this.currentOrders.amount) {
      this.message.warning("最大可设置订单数为" + this.currentOrders.amount + "件，无法添加新的软件记录！")
      return;
    }
    let isUnSave = false;
    this.ordersCopyrights.forEach((x) => {
      if (x.id === -1) {
        isUnSave = true;
      }
    })
    if (isUnSave) {
      this.message.warning("添加新的软件记录，先保存后再添加新的软件记录！")
      return
    }
    let data: any = {id: -1, name: null, author: this.currentOrders.customer, urgent: 0, edit: true};
    this.ordersCopyrights = [data, ...this.ordersCopyrights];
    // this.ordersCopyrights = [...this.ordersCopyrights, data]
    this.editCache[data.id] = data;
  }


  removeOrdersCopyrightAction(obj: any): void {
    let form: any = {};
    form.id = obj.id;
    this.nzTableConfirmLoading = true;
    const observable: Observable<R> = this.ordersCopyrightService.removeAction(form);
    observable.subscribe((data) => {
      this.nzTableConfirmLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.searchOrdersCopyright(this.currentOrders.id);
      }
    });
  }

  startEdit(data: any): void {
    data.edit = true;
    this.editCache[data.id] = data
  }

  cancelEdit(data: any): void {
    data.edit = false
    delete this.editCache[data.id]
    if (data.id === -1) {
      this.ordersCopyrights = this.ordersCopyrights.filter(d => d.id !== -1);
    }
  }

  saveEdit(obj: any): void {
    let copyright = this.editCache[obj.id];
    let form: any = {};
    if (copyright.id != -1) {
      form.id = copyright.id;
      form.ordersId = this.currentOrders.id;
    } else {
      form.ordersId = this.currentOrders.id;
    }
    form.name = copyright.name;
    if (U.StringUtils.isBank(form.name)) {
      this.message.warning("软件名称不能为空！");
      return
    }
    form.author = copyright.author;
    if (U.StringUtils.isBank(form.author)) {
      this.message.warning("著作权人不能为空！");
      return
    }
    form.urgent = (copyright.urgent == 1 || copyright.urgent == true) ? 1 : 0;
    this.nzTableConfirmLoading = true;
    const observable: Observable<R> = this.ordersCopyrightService.saveAction(form);
    observable.subscribe((data) => {
      this.nzTableConfirmLoading = false;
      if (R.isSuccess(data)) {
        this.searchOrdersCopyright(this.currentOrders.id);
        delete this.editCache[obj.id]
      }
    });
  }
}
