import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {EnumsService} from "../../../../shared/enums.service";
import {Observable} from "rxjs";
import {R, U} from "../../../../utils/utils";

@Component({
  selector: 'app-dictionary-checkbox',
  templateUrl: './enum-checkbox.component.html',
  styleUrls: ['./enum-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnumCheckboxComponent),
      multi: true
    }
  ]
})
export class EnumCheckboxComponent implements ControlValueAccessor, OnInit {

  allChecked = false;
  indeterminate = true;

  _counterValue = null;

  /**
   * 设置 nz-dictionary-select 的模式
   * 'multiple' | 'tags' | 'default'
   */
  @Input() dictCode: any = "default";

  checkOptionsOne: any[] = [];

  private onChange = (_: any) => {
  };

  constructor(private dictionaryService: EnumsService) {
  }

  ngOnInit(): void {
    if (U.StringUtils.isBank(this.dictCode)) {
      return;
    }
    this.checkOptionsOne = [];
    const observable: Observable<R> = this.dictionaryService.search(this.dictCode);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        // @ts-ignore
        data.t.forEach((dict) => {
          this.checkOptionsOne = [...this.checkOptionsOne,
            {label: dict.name, value: dict.code, checked: false}]
        })
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
      this.checkOptionsOne.forEach((one) => {
        one.checked = false;
      })
    }

    this.counterValue = obj;
    let radios: any[] = obj.split(",");
    this.checkOptionsOne.forEach((one) => {
      radios.forEach((radio) => {
        if (radio === one.checked) {
          one.checked = true;
        }
      })
    });

  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }

    this.readValue();
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }

    this.readValue();
  }

  readValue(): void {
    let dictionaries: any[] = []
    this.checkOptionsOne.forEach((x) => {
      if (x.checked) {
        dictionaries = [...dictionaries, x.value]
      }
    })
    this.counterValue = dictionaries.join(",");
  }
}

