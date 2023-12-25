import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../../../starter/shared/security-service";
import {CopyrightService} from "../../../../../shared/ipr/copyright.service";
import {R, U} from "../../../../../starter/utils/utils";
import {Observable} from "rxjs";
import {ParameterService} from "../../../../../shared/admin/parameter.service";
import {WebCommandService} from "../../../../../starter/shared/web-command-service";

@Component({
  selector: 'app-docx-dataset',
  templateUrl: './docx-dataset.component.html',
  styleUrls: ['./docx-dataset.component.scss']
})
export class DocxDatasetComponent implements OnInit {
  @Output() refreshEvent = new EventEmitter();
  @Output() closeViewEvent = new EventEmitter();

  validateForm!: UntypedFormGroup;

  currentDataset: any = {};
  nzModalSaveBtnLoading = false;

  //软件菜单列表
  parameters: any = {};
  docx_system_info = "";
  docx_soft_domain = "";
  docx_soft_purpose = "";
  docx_soft_main_func = "";
  docx_soft_feature = "";

  menus: any[] = [];
  childMenus: any[] = [];
  docxMenuName: any;
  childDocxMenuName: any;

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, private copyrightService: CopyrightService,
              private parameterService: ParameterService, private webCommandService: WebCommandService) {

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null, [Validators.required]],
      mainMenu: [null],
      sysInfo: [null, [Validators.required]],
      soft: [null, [Validators.required, Validators.maxLength(50)]],
      purpose: [null, [Validators.required, Validators.maxLength(50)]],
      mainFunc: [null, [Validators.required, Validators.maxLength(200)]],
      feature: [null, [Validators.required, Validators.maxLength(100)]],
    });
  }

  loadViewDataAction(obj: any) {
    this.validateForm.reset();
    this.currentDataset = obj;
    this.validateForm.get('id')?.setValue(obj.id);
    const codeup: any = U.StringUtils.isBank(obj.codeup) ? {} : JSON.parse(obj.codeup);
    this.validateForm.get('mainMenu')?.setValue(codeup.mainMenu || "");
    this.validateForm.get('sysInfo')?.setValue(codeup.sysInfo || "");
    this.validateForm.get('soft')?.setValue(codeup.soft || "");
    this.validateForm.get('purpose')?.setValue(codeup.purpose || "");
    this.validateForm.get('mainFunc')?.setValue(codeup.mainFunc || "");
    this.validateForm.get('feature')?.setValue(codeup.feature || "");

    this.menus = U.ObjectUtils.isNull(codeup.menus) ? [] : codeup.menus;
    if (U.StringUtils.isNotBank(this.validateForm.get('mainMenu')?.value)) {
      const mainManu = this.validateForm.get('mainMenu')?.value;
      const m: any[] = mainManu.split("-");
      this.docxMenuName = m[0];
      this.childDocxMenuName = m[1];
      this.changeMenuAction(this.docxMenuName);
    } else if (this.menus.length > 0) {
      this.docxMenuName = this.menus[0].name;
      if (this.menus[0].children && this.menus[0].children.length > 0) {
        this.childDocxMenuName = this.menus[0].children[0].name;
      }
      this.changeMenuAction(this.docxMenuName);
    }

    this.searchElementParameter();
  }

  saveAction(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      this.nzModalSaveBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.id = this.validateForm.get('id')?.value;
      let values = this.validateForm.value;
      let mainMenu: any = null;
      if (U.StringUtils.isNotBank(this.docxMenuName) && U.StringUtils.isNotBank(this.childDocxMenuName)) {
        values.mainMenu = this.docxMenuName + "-" + this.childDocxMenuName
      } else {
        values.mainMenu = "";
      }
      values.docxStep = U.StringUtils.isNotBank(values.mainMenu) ? 1 : 0 // 表示任务完成
      form.codeup = JSON.stringify(values);

      const observable: Observable<R> = this.copyrightService.updateCodeupAction(form);
      observable.subscribe((data) => {
        this.nzModalSaveBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          let codeup: any = JSON.parse(this.currentDataset.codeup);
          Object.assign(codeup, JSON.parse(form.codeup));
          this.currentDataset.codeup = JSON.stringify(codeup);
          this.refreshEvent.emit(this.currentDataset);
        }
      });
    }
  }


  searchElementParameter(): void {
    const query: any = {};
    query.parentCode = "copyright_dataset";
    query.codes = ['docx_system_info', 'docx_soft_domain', 'docx_soft_purpose', 'docx_soft_main_func', 'docx_soft_feature'];
    const observable: Observable<R> = this.parameterService.searchByParentCodeAndCodes(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.parameters = data.t;
        this.docx_system_info = this.parameters['docx_system_info'].val;
        this.docx_soft_domain = this.parameters['docx_soft_domain'].val;
        this.docx_soft_purpose = this.parameters['docx_soft_purpose'].val;
        this.docx_soft_main_func = this.parameters['docx_soft_main_func'].val;
        this.docx_soft_feature = this.parameters['docx_soft_feature'].val;

        if (U.StringUtils.isBank(this.validateForm.get('sysInfo')?.value)) {
          this.validateForm.get('sysInfo')?.setValue(this.parameters['docx_system_info'].val || "");
        }
        if (U.StringUtils.isBank(this.validateForm.get('soft')?.value)) {
          this.validateForm.get('soft')?.setValue(this.parameters['docx_soft_domain'].val || "");
        }
        if (U.StringUtils.isBank(this.validateForm.get('purpose')?.value)) {
          this.validateForm.get('purpose')?.setValue(this.parameters['docx_soft_purpose'].val || "");
        }
        if (U.StringUtils.isBank(this.validateForm.get('mainFunc')?.value)) {
          this.validateForm.get('mainFunc')?.setValue(this.parameters['docx_soft_main_func'].val || "");
        }
        if (U.StringUtils.isBank(this.validateForm.get('feature')?.value)) {
          this.validateForm.get('feature')?.setValue(this.parameters['docx_soft_feature'].val || "");
        }
      }

    });
  }

  changeMenuAction(event: any): void {
    this.menus.forEach((m: any) => {
      if (m.name == event) {
        this.childMenus = m.children;
      }
    })
  }

  clickCopyCommand(key: any): void {

    let docxCommand: any = this.parameters[key]
    if (U.ObjectUtils.isNull(docxCommand)) {
      this.message.warning("无效的文本复制命令")
      return;
    }
    let textCommand = docxCommand.val;
    // 系统介绍
    if (key == 'docx_system_info') {
      const cnName: any = this.currentDataset.name;
      textCommand = textCommand.replace('%cnName', cnName);

      let content = this.getMenuContent();
      textCommand = textCommand.replace('%menuInfo', JSON.stringify(content));
      this.webCommandService.clickCopyTextCommand(textCommand, "复制生成系统介绍文本命令成功");
    }

    // 面向的领域
    if (key == 'docx_soft_domain') {
      const cnName: any = this.currentDataset.name;
      textCommand = textCommand.replace('%cnName', cnName);
      this.webCommandService.clickCopyTextCommand(textCommand, "复制生成面向的领域文本命令成功");
    }

    // 开发目的
    if (key == 'docx_soft_purpose') {
      const cnName: any = this.currentDataset.name;
      textCommand = textCommand.replace('%cnName', cnName);
      let content = this.getMenuContent();
      textCommand = textCommand.replace('%menuInfo', JSON.stringify(content));
      this.webCommandService.clickCopyTextCommand(textCommand, "复制生成开发目的文本命令成功");
    }

    // 主要功能
    if (key == 'docx_soft_main_func') {
      const cnName: any = this.currentDataset.name;
      textCommand = textCommand.replace('%cnName', cnName);
      let content = this.getMenuContent();
      textCommand = textCommand.replace('%menuInfo', JSON.stringify(content));
      this.webCommandService.clickCopyTextCommand(textCommand, "复制生成主要功能文本命令成功");
    }

    // 技术特点
    if (key == 'docx_soft_feature') {
      this.webCommandService.clickCopyTextCommand(textCommand, "复制生成技术特点命令成功");
    }
  }

  getMenuContent(): any {
    let content: any[] = [];
    this.menus.forEach((pMenu) => {
      let menu: any = {
        "code": pMenu.code,
        "name": pMenu.name,
        "objective": pMenu.objective,
        "children": []
      }
      pMenu.children = U.ObjectUtils.isNull(pMenu.children) ? [] : pMenu.children;
      // @ts-ignore
      pMenu.children.forEach((x) => {
        menu.children = [...menu.children, {
          "code": x.code,
          "name": x.name,
          "objective": x.objective
        }]
      })
      content = [...content, menu];
    })
    return content;
  }

  showCopyCommandTips(parameterCode: string): string {

    let textCommand = "";
    if (parameterCode == 'docx_system_info') {
      textCommand = this.docx_system_info;
    }
    if (parameterCode == 'docx_soft_domain') {
      textCommand = this.docx_soft_domain;
    }
    if (parameterCode == 'docx_soft_purpose') {
      textCommand = this.docx_soft_purpose;
    }
    if (parameterCode == 'docx_soft_main_func') {
      textCommand = this.docx_soft_main_func;
    }
    if (parameterCode == 'docx_soft_feature') {
      textCommand = this.docx_soft_feature;
    }

    if (U.StringUtils.isBank(textCommand)) {
      return "点击复制执行命令";
    }

    return "点击复制，模版如下：" + textCommand;
  }

}
