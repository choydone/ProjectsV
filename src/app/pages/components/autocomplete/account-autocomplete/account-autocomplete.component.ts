import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CustomerService} from "../../../../shared/acc/customer.service";
import {Observable} from "rxjs";
import {R} from "../../../../starter/utils/utils";

@Component({
  selector: 'app-account-autocomplete',
  templateUrl: './account-autocomplete.component.html',
  styleUrls: ['./account-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountAutocompleteComponent),
      multi: true
    }
  ]
})
export class AccountAutocompleteComponent implements ControlValueAccessor, OnInit {
  inputValue = "";
  @Input() placeholder: any = "请输入";
  options: any[] = [];

  filteredOptions: string[] = [];
  private onChange = (_: any) => {
  };

  constructor(private customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.filteredOptions = [];
    this.options = [];
    const query: any = {};
    query.status = 20;
    const observable: Observable<R> = this.customerService.searchProfile(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        // @ts-ignore
        data.t.forEach(x => {
          this.options = [...this.options, x.name];
          this.filteredOptions = this.options;
        })
      }
    });
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
