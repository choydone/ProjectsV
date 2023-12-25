import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../../../starter/shared/security-service";
import {R, U} from "../../../../../starter/utils/utils";
import {RandomPhrase} from "../../../../../starter/utils/random-phrase";
import * as pinyin from "pinyin";
import {Convert} from "../../../../../starter/utils/convert";
import {Observable} from "rxjs";
import {CopyrightService} from "../../../../../shared/ipr/copyright.service";
import {ParameterService} from "../../../../../shared/admin/parameter.service";

@Component({
  selector: 'app-element-dataset',
  templateUrl: './element-dataset.component.html',
  styleUrls: ['./element-dataset.component.scss']
})
export class ElementDatasetComponent implements OnInit {
  @Output() refreshEvent = new EventEmitter();
  @Output() closeViewEvent = new EventEmitter();

  validateForm!: UntypedFormGroup;

  currentDataset: any = {};
  nzModalSaveBtnLoading = false;

  themes: any[] = [
    {name: '蓝', code: 'skin-blue|theme-dark'},
    {name: '绿', code: 'kin-green|theme-dark'},
    {name: '紫', code: 'skin-purple|theme-dark'},
    {name: '红', code: 'skin-red|theme-dark'},
    {name: '黄', code: 'skin-yellow|theme-dark'},
    {name: '蓝灰', code: 'skin-blue|theme-light'},
    {name: '绿灰', code: 'skin-green|theme-light'},
    {name: '紫灰', code: 'skin-purple|theme-light'},
    {name: '红灰', code: 'skin-red|theme-light'},
    {name: '黄灰', code: 'skin-yellow|theme-light'},
    {name: '蓝浅（新）', code: 'skin-blue|theme-blue'},
    {name: '绿浅（新）', code: 'skin-green|theme-blue'}
  ];

  navStyles: any[] = [
    {name: '左侧', code: 'default'},
    {name: '右侧', code: 'topnav'}
  ];


  parameters: any = {};

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, private copyrightService: CopyrightService,
              private parameterService: ParameterService) {

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null, [Validators.required]],
      basePackagePath: [null, [Validators.required]],
      appName: [null, [Validators.required]],
      description: [null, [Validators.required]],
      cnName: [null, [Validators.required]],
      shortName: [null, [Validators.required]],
      copyright: [null, [Validators.required]],
      author: [null, [Validators.required]],
      avatar: [null, [Validators.required]],
      carlet: [null, [Validators.required]],
      favicon: [null, [Validators.required]],
      loginBg: [null, [Validators.required]],
      theme: [null, [Validators.required]],
      navStyle: [null, [Validators.required]]
    });

  }

   loadViewDataAction(obj: any) {
    this.validateForm.reset();
    this.currentDataset = obj;
    this.validateForm.get('id')?.setValue(obj.id);
    let name = Convert.removeMultiSubstring(obj.name, ['系统', '管理', '平台'])
    const py = this.convertToPinyin(name);
    let customer = Convert.removeMultiSubstring(obj.customer, ['杭州', '浙江', '温州', '湖州', '科技', '技术', '服务'])
    const compy = this.convertToPinyin(customer);

    const codeup: any = U.StringUtils.isBank(obj.codeup) ? {} : JSON.parse(obj.codeup);
    this.validateForm.get('basePackagePath')?.setValue(codeup.basePackagePath || "com." + compy + "." + py);
    this.validateForm.get('appName')?.setValue(codeup.appName || py);
    this.validateForm.get('description')?.setValue(codeup.description || obj.customer + "-" + obj.name);
    this.validateForm.get('cnName')?.setValue(codeup.cnName || obj.name);
    this.validateForm.get('shortName')?.setValue(codeup.shortName || obj.name);
    this.validateForm.get('copyright')?.setValue(codeup.copyright || "Copyright © 2018-2023 " + compy + ".com All Rights Reserved.");
    this.validateForm.get('author')?.setValue(codeup.author || obj.author);
    this.validateForm.get('avatar')?.setValue(codeup.avatar || "");
    this.validateForm.get('carlet')?.setValue(codeup.carlet || RandomPhrase.getPhrases());
    this.validateForm.get('favicon')?.setValue(codeup.favicon || "");
    this.validateForm.get('loginBg')?.setValue(codeup.loginBg || "");
    const themeObj: any = Convert.getRandomElement(this.themes);
    this.validateForm.get('theme')?.setValue(codeup.theme|| themeObj.code);
    const navStyleObj: any = Convert.getRandomElement(this.navStyles);
    this.validateForm.get('navStyle')?.setValue(codeup.navStyle || navStyleObj.code);

    this.searchElementParameter();

    // if (U.StringUtils.isBank(obj.codeup)) {
    //   let name = Convert.removeMultiSubstring(obj.name, ['系统', '管理', '平台'])
    //   const py = this.convertToPinyin(name);
    //   let customer = Convert.removeMultiSubstring(obj.customer, ['杭州', '浙江', '温州', '湖州', '科技', '技术', '服务'])
    //   const compy = this.convertToPinyin(customer);
    //   this.validateForm.get('id')?.setValue(obj.id);
    //   this.validateForm.get('basePackagePath')?.setValue("com." + compy + "." + py);
    //   this.validateForm.get('appName')?.setValue(py);
    //   this.validateForm.get('description')?.setValue(obj.customer + "-" + obj.name);
    //   this.validateForm.get('cnName')?.setValue(obj.name);
    //   this.validateForm.get('shortName')?.setValue(obj.name);
    //   this.validateForm.get('copyright')?.setValue("Copyright © 2018-2023 " + compy + ".com All Rights Reserved.");
    //   this.validateForm.get('author')?.setValue(obj.author);
    //   this.validateForm.get('avatar')?.setValue("/img/profile.jpg");
    //   this.validateForm.get('carlet')?.setValue(RandomPhrase.getPhrases());
    //   this.validateForm.get('favicon')?.setValue("http://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png");
    //   this.validateForm.get('loginBg')?.setValue("https://dss0.bdstatic.com/l4oZeXSm1A5BphGlnYG/skin/19.jpg?2");
    //   // this.validateForm.get('theme')?.setValue("skin-purple|theme-light");
    //   const themeObj: any = Convert.getRandomElement(this.themes);
    //   this.validateForm.get('theme')?.setValue(themeObj.code);
    //   const navStyleObj: any = Convert.getRandomElement(this.navStyles);
    //   this.validateForm.get('navStyle')?.setValue(navStyleObj.code);
    // } else {
    //   const codeup: any = JSON.parse(obj.codeup);
    //   this.validateForm.get('id')?.setValue(codeup.id);
    //   this.validateForm.get('basePackagePath')?.setValue(codeup.basePackagePath);
    //   this.validateForm.get('appName')?.setValue(codeup.appName);
    //   this.validateForm.get('description')?.setValue(codeup.description);
    //   this.validateForm.get('cnName')?.setValue(codeup.cnName);
    //   this.validateForm.get('shortName')?.setValue(codeup.shortName);
    //   this.validateForm.get('copyright')?.setValue(codeup.copyright);
    //   this.validateForm.get('author')?.setValue(codeup.author);
    //   this.validateForm.get('avatar')?.setValue(codeup.avatar);
    //   this.validateForm.get('carlet')?.setValue(codeup.carlet);
    //   this.validateForm.get('favicon')?.setValue(codeup.favicon);
    //   this.validateForm.get('loginBg')?.setValue(codeup.loginBg);
    //   this.validateForm.get('theme')?.setValue(codeup.theme);
    //   this.validateForm.get('navStyle')?.setValue(codeup.navStyle);
    // }
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
      values.elementStep = 1 // 表示任务完成
      values.artifactId = values.appName;
      values.version = "1.0";
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

  generateFavicon(): void {
    let customer = Convert.removeMultiSubstring(this.currentDataset.customer, ['杭州', '浙江', '温州', '湖州', '科技', '技术', '服务'])
    if (U.StringUtils.isBank(customer)) {
      return;
    }
    const query: any = {};
    query.name = customer;
    const observable: Observable<R> = this.copyrightService.generateFaviconAction(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.validateForm.get('favicon')?.setValue(data.t);
      }
    });
  }

  searchElementParameter(): void {
    const query: any = {};
    query.parentCode = "copyright_dataset";
    query.codes = ['default_logon_avatar', 'default_logon_favicon', 'default_logon_graph'];
    const observable: Observable<R> = this.parameterService.searchByParentCodeAndCodes(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.parameters = data.t;
        if(U.StringUtils.isBank(this.validateForm.get('avatar')?.value)){
          this.validateForm.get('avatar')?.setValue(this.parameters['default_logon_avatar'].val || "/img/profile.jpg");
        }
        if(U.StringUtils.isBank(this.validateForm.get('favicon')?.value)){
          this.validateForm.get('favicon')?.setValue(this.parameters['default_logon_favicon'].val || "/img/favicon.jpg");
          // 这里自动生成一张logo图
          this.generateFavicon();
        }
        if(U.StringUtils.isBank(this.validateForm.get('loginBg')?.value)){
          this.validateForm.get('loginBg')?.setValue(this.parameters['default_logon_graph'].val || "/img/graph.jpg");
        }
      }
    });
  }

  convertToPinyin(str: string): string {
    const words = str.split('');
    const firstLetters = words.map((word) => pinyin(word, {style: pinyin.STYLE_FIRST_LETTER})[0][0]);
    return firstLetters.join('').toLowerCase();
  }

}
