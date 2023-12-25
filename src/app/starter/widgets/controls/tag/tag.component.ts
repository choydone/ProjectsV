import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {U} from "../../../utils/utils";

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagComponent),
      multi: true
    }
  ]
})
export class TagComponent implements ControlValueAccessor, OnInit {

  @ViewChild('inputElement', {static: false}) inputElement?: ElementRef;

  tags: any[] = [];
  inputVisible = false;
  inputValue = '';

  _counterValue = "";

  private onChange = (_: any) => {
  };

  constructor() {
  }

  ngOnInit(): void {
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
    if (U.StringUtils.isNotBank(obj)) {
      this.tags = obj.split(',');
      this.counterValue = obj;
      return;
    }
    this.tags = [];
    this.counterValue = "";
  }


  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;

    this.counterValue = this.tags.join(",");
  }

}
