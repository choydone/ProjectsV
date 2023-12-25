import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CustomerService} from "../../../../shared/acc/customer.service";
import {Observable} from "rxjs";
import {R, U} from "../../../../starter/utils/utils";
import {CodeDesignService} from "../../../../shared/admin/code-design.service";

@Component({
  selector: 'app-code-design-autocomplete',
  templateUrl: './code-design-autocomplete.component.html',
  styleUrls: ['./code-design-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeDesignAutocompleteComponent),
      multi: true
    }
  ]
})
export class CodeDesignAutocompleteComponent implements ControlValueAccessor, OnInit {
  inputValue = "";

  @Output() changeEvent = new EventEmitter();
  @Input() placeholder: any = "请输入";
  @Input() codeDesign: any = "";
  @Input() readonly: any = false;

  options: any[] = [];
  filteredOptions: string[] = [];
  codeDesigns: any[] = [];

  private onChange = (_: any) => {
  };

  constructor(private codeDesignService: CodeDesignService) {
  }

  ngOnInit(): void {
    if (U.StringUtils.isBank(this.codeDesign)) {
      return;
    }
    this.filteredOptions = [];
    this.options = [];
    this.codeDesigns = [];
    const observable: Observable<R> = this.codeDesignService.searchByCode(this.codeDesign);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.codeDesigns = data.t;
        // @ts-ignore
        data.t.forEach(x => {
          this.options = [...this.options, x.code];
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
    let isExist = false;
    this.codeDesigns.forEach((codeDesign) => {
      if (codeDesign.code == value) {
        this.changeEvent.emit(codeDesign);
        isExist=true;
      }
    })
    if(!isExist){
      this.changeEvent.emit({});
    }
  };
}
