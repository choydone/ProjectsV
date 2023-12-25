import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {U} from "../../../utils/utils";

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {

  _counterValue = null;

  @Input() checkboxs: any[] = [];

  private onChange = (_: any) => {
  };

  constructor() {
  }

  ngOnInit(): void {
    this.checkboxs.forEach((checkbox) => {
      checkbox.checked = false;
    })
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
      this.checkboxs.forEach((checkbox) => {
        checkbox.checked = false;
      })
      this.counterValue = null;
      return;
    }
    this.counterValue = obj;
    this.checkboxs.forEach((checkbox) => {
      checkbox.checked = false;
      if (checkbox.value == obj) {
        checkbox.checked = true;
      }
    })
  }

  changeCheckBoxEvent(event: any, _checkbox: any): void {
    this.checkboxs.forEach((checkbox) => {
      checkbox.checked = false;
      if (checkbox.value == _checkbox.value) {
        checkbox.checked = true;
        this.counterValue = _checkbox.value;
      }
    })

    // this.checkboxs.forEach((checkbox) => {
    //   if (checkbox.value == _checkbox.value) {
    //     checkbox.checked = false;
    //   }
    // })
    // this.counterValue = null;
  }

}
