import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {NzMessageService} from 'ng-zorro-antd/message';
import {R} from "../../../../utils/utils";

@Component({
  selector: 'app-doc-single-card',
  templateUrl: './doc-single-card.component.html',
  styleUrls: ['./doc-single-card.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocSingleCardComponent),
      multi: true
    }
  ]
})
export class DocSingleCardComponent implements ControlValueAccessor, OnInit {
  avatarLoading = false;
  _avatarUrl?: string;


  @Input() objectName: any;
  @Input() title: any = '文件';
  @Input() tips: any[] = ['只支持PDF格式，限10M内'];

  private onChange = (_: any) => {
  };

  constructor(private message: NzMessageService) {
  }

  ngOnInit(): void {
  }

  get avatarUrl(): any {
    return this._avatarUrl;
  }

  set avatarUrl(value) {
    this._avatarUrl = value;
    // 触发 onChange，component 内部的值同步到 form model
    this.onChange(this._avatarUrl);
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
    // this.value = obj; // form中给你设置了obj值，根据obj，去更新组件/UI
    this.avatarUrl = obj;
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    // tslint:disable-next-line:no-non-null-assertion
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.avatarLoading = true;
        break;
      case 'done':
        this.avatarLoading = false;
        const data = info.file.response as R;
        if (R.isSuccess(data)) {
          this.message.success(`${info.file.name} 文件上传成功.`);
          this.avatarUrl = data.t;
        } else {
          this.avatarUrl = '';
        }
        break;
      case 'error':
        this.message.error(`${info.file.name} 文件上传失败.`);
        this.avatarLoading = false;
        break;
    }
  }


}
