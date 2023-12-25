import {Component, Directive, Input, OnInit} from '@angular/core';

@Directive()
export abstract class CopyrightBaseComponent {

  protected constructor() {
  }

  /**
   * 文件下载
   * @param path 文件url地址
   * @param fileName 可选
   */
  downloadFileAction(path: string): void {
    window.open(path, '_blank');
  }

}
