import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import * as jsonc from "jsonc-parser";
// @ts-ignore
import { CodeEditorComponent2 } from '@ngstack/code-editor';
import {U} from "../../../utils/utils";

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeEditorComponent),
      multi: true
    }
  ]
})
export class CodeEditorComponent implements ControlValueAccessor, OnInit {
  @ViewChild('editor') editor: CodeEditorComponent2;

  @Input() theme = 'vs-dark';
  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    },
    dependencies: [
      '@types/node',
      '@ngstack/translate',
      '@ngstack/code-editor'
    ]
  };
  codeModel: any = {
    language: 'json',
    value: '[]',
  };


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
    this.counterValue = obj;
    if (U.StringUtils.isBank(obj)) {
      this.codeModel.value = obj;
      return;
    }

    const errors: jsonc.ParseError[] = [];
    const res: any = jsonc.parse(obj, errors, {allowTrailingComma: true});
    if (errors.length) {
      console.error(errors);
      return;
    }
    const formattedJson = JSON.stringify(res, null, 2);
    this.codeModel.value = formattedJson;
    this.codeModel = JSON.parse(JSON.stringify(this.codeModel));
  }

  changeCodeAction(value: any): void {
    this.counterValue = value/// this.code;
    // if (StringUtils.isBank(value)) {
    //   this.codeModel.value = value;
    //   return;
    // }

    // const errors: jsonc.ParseError[] = [];
    // const res: any = jsonc.parse(value, errors, {allowTrailingComma: true});
    // if (errors.length) {
    //   console.error(errors);
    //   return;
    // }
    // const formattedJson = JSON.stringify(res, null, 2);
    // this.codeModel.value = formattedJson; // 更新 codeModel
    // this.codeModel = JSON.parse(JSON.stringify(this.codeModel));
  }

  formatJson() {
    if (U.StringUtils.isBank(this.codeModel.value)) {
      return;
    }

    const json = this.codeModel.value;
    const errors: jsonc.ParseError[] = [];
    const res: any = jsonc.parse(json, errors, {allowTrailingComma: true});
    if (errors.length) {
      console.error(errors);
      return;
    }
    const formattedJson = JSON.stringify(res, null, 2);
    this.codeModel.value = formattedJson;
    this.codeModel = JSON.parse(JSON.stringify(this.codeModel));

  }
}
