import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-autocomplete-easy',
  templateUrl: './autocomplete-easy.component.html',
  styleUrls: ['./autocomplete-easy.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteEasyComponent),
      multi: true
    }
  ]
})
export class AutocompleteEasyComponent implements ControlValueAccessor, OnInit {
  inputValue = "";
  @Input() placeholder: any = "请输入";
  @Input() options: any[] = [];

  filteredOptions: string[] = [];

  private onChange = (_: any) => {
  };

  constructor(private message: NzMessageService) {
    this.filteredOptions = this.options;
  }

  ngOnInit(): void {
  }


  registerOnChange(fn: any): void {
    this.onChange = fn; // 保存这个函数
  }

  registerOnTouched(fn: any): void {
    // this.onTouched = fn; // 保存这个函数
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this.inputValue = obj;
  }

  onChangeAction(value: any): void {
    this.filteredOptions = this.options.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    this.onChange(value);
  };

}
