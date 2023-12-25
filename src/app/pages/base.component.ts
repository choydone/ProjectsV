import {AfterViewInit, Directive, ElementRef, OnInit, ViewChild} from "@angular/core";
import {SecurityService} from "../starter/shared/security-service";
import {P, R, U} from "../starter/utils/utils";
import {WebCommandService} from "../starter/shared/web-command-service";


export abstract class Dictionary {

  fallback =
    'data:image/png;base64,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';

  /**
   * 表格通用查询modal
   */
  tplStatus: boolean = true;  // 记录状态
  tplSingleWidth: string = "60px";// 表格单个内容默认宽度
  tplCheckboxWidth: string = "40px";// 表格选中框默认宽度
  tplSearchValue: string = "";  // 通用查询条件
  tplSmallWidth: string = "80px";// 表格默认宽度
  tplMiddleWidth: string = "120px";// 表格默认宽度
  tplDefaultWidth: string = "180px";// 表格默认宽度
  tplDateWidth: string = "150px";// 表格时间列表默认宽度
  tplNameWidth: string = "100px";// 表格员工名列表默认宽度
  tplStatusWidth: string = "80px";// 表格状态列表默认宽度
  tplIdWidth: string = "60px";// 表格ID列表默认宽度
  tplSortWidth: string = "70px";// 表格顺序列表默认宽度
  tplRemarkWidth: string = "120px";// 表格备注默认宽度
  tpl1BtnWidth: string = "60px";// 表格按钮默认宽度
  tpl2BtnWidth: string = "120px";// 表格按钮默认宽度
  tpl3BtnWidth: string = "180px";// 表格按钮默认宽度

  tplWidth40: string = "40px";
  tplWidth50: string = "50px";
  tplWidth60: string = "60px";
  tplWidth70: string = "70px";
  tplWidth80: string = "80px";
  tplWidth90: string = "90px";
  tplWidth100: string = "100px";
  tplWidth110: string = "110px";
  tplWidth120: string = "120px";
  tplWidth130: string = "130px";
  tplWidth140: string = "140px";
  tplWidth160: string = "160px";
  tplWidth180: string = "180px";
  tplWidth200: string = "200px";
  tplWidth230: string = "230px";
  tplWidth240: string = "240px";
}


@Directive()
export abstract class BaseComponent extends Dictionary implements OnInit, AfterViewInit {
  add = "add";
  edit = "edit";

  /**
   *  日期控件统一格式
   */
  dateFormat = 'yyyy-MM-dd';

  /**
   * 默认的页面内容高度
   */
  pageContentHeight: string = '100%';

  /**
   * 默认的页面内容宽带
   */
  pageContentWidth: string = '100%';

  /**
   * pageContent 默认的数据内容。
   */
  @ViewChild("pageContent") _divView!: ElementRef;

  /**
   * 基本表格
   */
  @ViewChild("robotTable") _robotTable!: ElementRef;
  tplTableOffsetX: string = "100px";
  tplTableOffsetY: number = 300;

  constructor(public securityService: SecurityService, public webCommandService: WebCommandService) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this._divView === undefined) {
      return;
    }
    setTimeout(() => {
      this.pageContentHeight = this._divView.nativeElement.clientHeight + "px";
      this.pageContentWidth = this._divView.nativeElement.clientWidth + "px";

      if (U.ObjectUtils.nonNull(this._robotTable)) {
        // @ts-ignore
        this.tplTableOffsetX = this._robotTable.elementRef.nativeElement.offsetWidth + "px";
        this.tplTableOffsetY = this._divView.nativeElement.clientHeight - 130;
      } else {
        this.tplTableOffsetY = this._divView.nativeElement.clientHeight - 130;
      }
    }, 10)
  }

  getQueryForm(form: any, query: any) {
    Object.keys(form).forEach(key => {
      if (U.ObjectUtils.nonNull(form[key])) {
        if (form[key] instanceof Array) {
          if (form[key][0] instanceof Date) {
            query['startDate'] = P.formatDate(form[key][0]);
            query['endDate'] = P.formatDate(form[key][1]);
          }
        } else if (form[key][0] instanceof Date) {
          query[key] = P.formatDate(form[key][0]);
        } else {
          query[key] = form[key];
        }
      }
    });
  }

  /**
   * 表格显示数据记录
   */
  tplCheckedStatus(event: any): void {
    this.tplStatus = event
  }

  /**
   * 按钮权限设置
   * @param key
   */
  checkPermission(key: string): boolean {
    return this.securityService.checkPermission(key);
  }


  /**
   * 文件下载
   * @param path 文件url地址
   * @param fileName 可选
   */
  downloadFileAction(path: string): void {
    window.open(path, '_blank');
  }

  goto(url: any) {
    window.open(url, '_blank');
  }

  doCopy(text: string, message: string = "复制成功"): void {
    this.webCommandService.clickCopyTextCommand(text, message)
  }


}


