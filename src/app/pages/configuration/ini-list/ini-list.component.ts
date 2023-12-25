import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../starter/shared/security-service";
import {Observable} from "rxjs";
import {P, R, U} from "../../../starter/utils/utils";
import {IniService} from "../../../shared/admin/ini.service";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-ini-list',
  templateUrl: './ini-list.component.html',
  styleUrls: ['./ini-list.component.scss']
})
export class IniListComponent extends BaseComponent {

  // 分页参数
  iniData: any[] = [];
  // 表格加载标志
  nzTableLoading = false;

  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;
  validateForm!: UntypedFormGroup;


  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService, private iniService: IniService) {
    super(securityService, webCommandService);
  }

  override ngOnInit(): void {
    this.validateForm = this.fb.group({
      key: [null, [Validators.required]],
      value: [null, [Validators.required]]
    });
    this.search()
  }

  search(): void {
    // 获取基础数据-分页数据
    const query: any = {};
    // 表单数据
    query.searchValue = this.tplSearchValue;
    if (!this.tplStatus) {
      // 未选中全部，则显示正常可用的
      query.status = 20;
    }

    this.nzTableLoading = true;
    const observable: Observable<R> = this.iniService.search(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.iniData = data.t;
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
      this.validateForm.get('key')?.setValue(obj.key);
      this.validateForm.get('value')?.setValue(obj.value);
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
   * 保存角色事件
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
      form.key = this.validateForm.get('key')?.value;
      form.value = this.validateForm.get('value')?.value;
      const observable: Observable<R> = this.iniService.saveAction(form);
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
   * 删除角色事件
   */
  removeAction(role: any): void {
    const form: any = {};
    form.key = role.key;
    const observable: Observable<R> = this.iniService.removeAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search();
      }
    });
  }


}

