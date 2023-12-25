import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {EnumsService} from "../../../../shared/enums.service";
import {Observable} from "rxjs";
import {R, U} from "../../../../utils/utils";

@Component({
  selector: 'app-enum-radio',
  templateUrl: './enum-radio.component.html',
  styleUrls: ['./enum-radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnumRadioComponent),
      multi: true
    }
  ]
})
export class EnumRadioComponent implements ControlValueAccessor, OnInit {

  _counterValue = null;

  @Input() radioValue: any = "";

  @Input() nzDisabled: any = false;

  /**
   * 设置 nz-dictionary-select 的模式
   * 'multiple' | 'tags' | 'default'
   */
  @Input() enumClass: any = "default";

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
      this.radioValue = "";
      return;
    }
    this.counterValue = obj;
    this.radioValue = obj;
  }

  radioAction(event: any): void {
    this.counterValue = event;
  }
}

