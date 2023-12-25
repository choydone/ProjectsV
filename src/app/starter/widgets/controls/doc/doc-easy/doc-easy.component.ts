import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DocStyle} from "../../../../utils/doc-style";
import {R, U} from "../../../../utils/utils";

@Component({
  selector: 'app-doc-easy',
  templateUrl: './doc-easy.component.html',
  styleUrls: ['./doc-easy.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocEasyComponent),
      multi: true
    }
  ]
})
export class DocEasyComponent implements ControlValueAccessor, OnInit {

  @Input() objectName: any;
  @Input() btnName: any = 'Upload';
  @Input() tips: any[] = ['请使用正确的文件名称，方便后续查询，限100M内'];
  @Input() limit = 1;
  @Input() maxCount = 1;

  defaultFileList: NzUploadFile[] = []
  private onChange = (_: any) => {
  };

  constructor(private message: NzMessageService) {
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

  writeValue(obj: any | any[]): void {
    this.defaultFileList = [];
    let fileLists: any[] = [];
    fileLists = (obj instanceof Array) ? obj : U.StringUtils.isBank(obj) ? [] : [...fileLists, obj];

    fileLists.forEach((x) => {
      this.defaultFileList = [...this.defaultFileList,
        {
          uid: '-1',
          name: DocStyle.autoFileName(x),
          status: 'done',
          url: x,
          thumbUrl: x,
          linkProps: {download: x},
        }
      ];
    })
  }

  handleChange(info: { file: NzUploadFile, fileList: NzUploadFile[]; }): void {
    switch (info.file.status) {
      case 'done':
        const data = info.file.response as R;
        if (R.isSuccess(data)) {
          this.message.success(`${info.file.name} 文件上传成功.`);
          this.defaultFileList = [...this.defaultFileList,
            {
              uid: '-1',
              name: DocStyle.autoFileName(data.t),
              status: 'done',
              url: data.t,
              thumbUrl: data.t,
              linkProps: {download: data.t},
            }
          ];
          let paths: any[] = [];
          this.defaultFileList.forEach((f) => {
            paths = [...paths, f.url]
          })
          this.onChange(paths);
        } else {
          this.message.error(`${info.file.name} 文件上传失败.`);
        }
        break;
      case 'error':
        this.message.error(`${info.file.name} 文件上传失败.`);
        break;
    }
  }

  removeAction(file: any): void {
    this.defaultFileList = this.defaultFileList.filter(d => d.url !== file.url);
    let paths: any[] = [];
    this.defaultFileList.forEach((f) => {
      paths = [...paths, f.url]
    })
    this.onChange(paths);
  }



}
