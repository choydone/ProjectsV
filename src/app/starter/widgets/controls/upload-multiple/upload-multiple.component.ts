import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import {R} from "../../../utils/utils";

@Component({
  selector: 'app-upload-multiple',
  templateUrl: './upload-multiple.component.html',
  styleUrls: ['./upload-multiple.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadMultipleComponent),
      multi: true
    }
  ]
})
export class UploadMultipleComponent implements ControlValueAccessor, OnInit {
  _filePathList: any[] = [];

  @Input() objectName: any;
  @Input() title: any = '单击或拖动文件到此区域进行上传';
  @Input() hint: any = '支持单个或批量上传。严禁上传非项目有关的文件或其他垃圾文件';

  private onChange = (_: any) => {
  };

  constructor(private message: NzMessageService) {
  }

  ngOnInit(): void {
  }


  get filePathList(): any {
    return this._filePathList;
  }

  set filePathList(value) {
    this._filePathList = [...this._filePathList, value];
    // 触发 onChange，component 内部的值同步到 form model
    this.onChange(this._filePathList);
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
    // this._filePathList = obj;
  }

  handleChange({file, fileList}: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      const data = file.response as R;
      if (R.isSuccess(data)) {
        this.message.success(`${file.name} 文件上传成功.`);
        this.filePathList = data.t[0];
      } else {
      }
    } else if (status === 'error') {
      this.message.error(`${file.name} 文件上传失败.`);
    }
  }


}
