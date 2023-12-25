import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {EnumsService} from "../../../../shared/enums.service";
import {Observable} from "rxjs";
import {R, U} from "../../../../utils/utils";

@Component({
  selector: 'app-enum-select',
  templateUrl: './enum-select.component.html',
  styleUrls: ['./enum-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnumSelectComponent),
      multi: true
    }
  ]
})
export class EnumSelectComponent implements ControlValueAccessor, OnInit {

  _counterValue = null;

  /**
   * 设置 nz-dictionary-select 的模式
   * 'multiple' | 'tags' | 'default'
   */
  @Input() nzMode: any = "default";


  /**
   * 使单选模式可搜索
   */
  @Input() nzShowSearch: boolean = true;

  /**
   * 支持清除
   */
  @Input() nzAllowClear: boolean = true;

  /**
   * 选择框默认文字
   */
  @Input() nzPlaceHolder: string = "请选择";

  /**
   * 设置 nz-dictionary-select 的模式
   * 'multiple' | 'tags' | 'default'
   */
  @Input() enumClass: any = "default";


  @Input() selectedValue: any | any[] = "" || [];


  enums: any[] = [];

  private onChange = (_: any) => {
  };

  constructor(private enumsService: EnumsService) {
  }

  ngOnInit(): void {
    if (U.StringUtils.isBank(this.enumClass)) {
      return;
    }

    const observable: Observable<R> = this.enumsService.search(this.enumClass);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.enums = data.t;
      }
    });
  }

  get counterValue(): any {
    return this._counterValue;
  }

  set counterValue(value) {
    this._counterValue = value;
    // 触发 onChange，component 内部的值同步到 form model
    this.onChange(this._counterValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn; // 保存这个函数
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    if (U.ObjectUtils.isNull(obj)) {
      this.counterValue = null;
      this.selectedValue = "";
      return;
    }
    this.counterValue = obj;
    this.selectedValue = obj;
    // this.checkboxs.forEach((checkbox) => {
    //   checkbox.checked = false;
    //   if (checkbox.value == obj) {
    //     checkbox.checked = true;
    //   }
    // })
  }

  selectedAction(event: any): void {
    this.counterValue = event;
  }

  // this.checkboxs.forEach((checkbox) => {
  //   if (checkbox.value == _checkbox.value) {
  //     checkbox.checked = false;
  //   }
  // })
  // this.counterValue = null;
}

