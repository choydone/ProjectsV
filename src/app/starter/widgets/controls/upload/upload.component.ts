import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {Observable, Observer} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {R} from "../../../utils/utils";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadComponent),
      multi: true
    }
  ]
})
export class UploadComponent implements ControlValueAccessor, OnInit {
  previewImage = '';
  previewVisible = false;
  avatarLoading = false;
  _avatarUrl?: string;
  // currentId: any = {};


  @Input() ossBucket: any;
  @Input() title: any = '头像';
  // @Input() avatarUrl: any;

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

  /**
   * 头像上传
   */
  handlePreview = (file: any) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        this.message.error('产品logo图片只支持 JPG、PNG、GIF 格式文件!');
        observer.complete();
        return;
      }
      // tslint:disable-next-line:no-non-null-assertion
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.message.error('产品logo图片必需小于2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };

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
        // Get this url from response in real world.
        // tslint:disable-next-line:no-non-null-assertion
        /* this.getBase64(info.file!.originFileObj!, (img: string) => {
           this.avatarLoading = false;
           this.avatarUrl = img;
         });
 */
        this.avatarLoading = false;
        const data = info.file.response as R;
        if (R.isSuccess(data)) {
          this.message.success(`${info.file.name} 文件上传成功.`);
          this.avatarUrl = data.t;
        } else {
          // this.message.error(data.description);
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
