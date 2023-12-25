import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../../../starter/shared/security-service";
import {R, U} from "../../../../../starter/utils/utils";
import {Observable} from "rxjs";
import {CopyrightService} from "../../../../../shared/ipr/copyright.service";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {Convert} from "../../../../../starter/utils/convert";
import {NzModalService} from "ng-zorro-antd/modal";
import {ParameterService} from "../../../../../shared/admin/parameter.service";
import {WebCommandService} from "../../../../../starter/shared/web-command-service";
import {
  CopyrightAutoConsoleComponent
} from "../../../components/copyright-auto-console/copyright-auto-console.component";
import {RobotScriptService} from "../../../../../shared/robot-script.service";

@Component({
  selector: 'app-kernel-dataset',
  templateUrl: './kernel-dataset.component.html',
  styleUrls: ['./kernel-dataset.component.scss'],

})
export class KernelDatasetComponent implements OnInit {
  isSpinning = false;
  @Output() refreshEvent = new EventEmitter();
  @Output() closeViewEvent = new EventEmitter();

  autoModalVisible = false;
  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef})
  dynamicComponentContainer?: ViewContainerRef;


  validateForm!: UntypedFormGroup;
  parameters: any = {};
  copyright_mock_command = "";
  copyright_field_command = "";
  copyright_menu_command = "";

  currentDataset: any = {};
  elementStep = 0;
  nzModalSaveBtnLoading = false;
  currentMenu: any = {};

  // 菜单操作模块
  currentContextMenu: any = {};
  // 弹框显示标志
  nzModalMenuVisible = false;
  // 弹框内按钮loading标志
  nzModalMenuBtnLoading = false;
  validateMenuForm!: UntypedFormGroup;
  // 当前操作
  currentAction = 'edit';

  // 编辑菜单字段模块
  nzModalFieldVisible = false;
  nzModalFieldBtnLoading = false;
  validateFieldForm!: UntypedFormGroup;
  currentField: any = null;

// 编辑菜单模拟数据模块
  nzModalMockVisible = false;
  nzModalMockBtnLoading = false;
  validateMockForm!: UntypedFormGroup;
  currentMock: any = null;

  menus: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, private copyrightService: CopyrightService,
              private nzContextMenuService: NzContextMenuService, private modal: NzModalService,
              private parameterService: ParameterService, public webCommandService: WebCommandService,
              private robotScriptService: RobotScriptService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null, [Validators.required]]
    });

    this.validateMenuForm = this.fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      objective: [null, [Validators.required]],
    });

    this.validateFieldForm = this.fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      isQuery: [null, [Validators.required]],
      value: [null]
    });

    this.validateMockForm = this.fb.group({});
  }

  /**
   *  订单确认操作
   */
  loadViewDataAction(obj: any): void {
    this.validateForm.reset();
    this.currentDataset = obj;
    this.validateForm.get('id')?.setValue(obj.id);
    const codeup: any = U.StringUtils.isBank(obj.codeup) ? {} : JSON.parse(obj.codeup);
    this.menus = U.ObjectUtils.isNull(codeup.menus) ? [] : codeup.menus;
    this.elementStep = codeup.elementStep;
    this.searchElementParameter();
  }

  searchElementParameter(): void {
    const query: any = {};
    query.parentCode = "copyright_dataset";
    query.codes = ['copyright_mock_command', 'copyright_field_command', 'copyright_menu_command'];
    const observable: Observable<R> = this.parameterService.searchByParentCodeAndCodes(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.parameters = data.t;
        this.copyright_mock_command = this.parameters['copyright_mock_command'].val
        this.copyright_field_command = this.parameters['copyright_field_command'].val
        this.copyright_menu_command = this.parameters['copyright_menu_command'].val
      }
    });
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
      form.codeup = JSON.stringify({menus: this.menus, kernelStep: 0});// 表示草稿模式
      form.codeup = this.automaticErrorCorrect(form.codeup);
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

  /**
   * 自动测试，测试成功后修改状态为完成
   */
  openMenuViewAction(event: any): void {
    this.currentAction = event;
    if (this.currentAction == 'edit') {
      this.validateMenuForm.get("code")?.setValue(this.currentContextMenu.code)
      this.validateMenuForm.get("name")?.setValue(this.currentContextMenu.name)
      this.validateMenuForm.get("objective")?.setValue(this.currentContextMenu.objective)
    }
    this.nzModalMenuBtnLoading = false;
    this.nzModalMenuVisible = true;
  }

  saveMenuAction(): void {
    for (const i in this.validateMenuForm.controls) {
      this.validateMenuForm.controls[i].markAsDirty();
      this.validateMenuForm.controls[i].updateValueAndValidity();
    }
    if (this.validateMenuForm.valid) {
      if (this.currentAction == 'edit') {
        this.currentContextMenu.code = this.validateMenuForm.get('code')?.value
        this.currentContextMenu.name = this.validateMenuForm.get('name')?.value
        this.currentContextMenu.objective = this.validateMenuForm.get('objective')?.value
      } else {
        if (U.ObjectUtils.isNull(this.currentContextMenu.children)) {
          this.currentContextMenu.children = [];
        }
        this.currentContextMenu.children = [...this.currentContextMenu.children, {
          "code": this.validateMenuForm.get('code')?.value,
          "name": this.validateMenuForm.get('name')?.value,
          "objective": this.validateMenuForm.get('objective')?.value
        }]
      }
      this.autoSaveAction();
      this.closeMenuViewAction();
    }
  }

  closeMenuViewAction(): void {
    this.validateMenuForm.reset();
    this.nzModalMenuVisible = false;
    this.nzModalMenuBtnLoading = false;
  }


  showDeleteConfirmAction(event: any): void {
    this.modal.confirm({
      nzTitle: '是否确认删除该【' + this.currentContextMenu.name + '】菜单节点。',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.removeMenuAction(event),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  removeMenuAction(event: any): void {
    let code: any = this.currentContextMenu.code;
    if (event == 0) {
      // @ts-ignore
      this.menus.forEach((menu) => {
        // @ts-ignore
        menu.children = menu.children.filter(d => d.code !== code);
      })
      this.autoSaveAction();
      return;
    }

    if (event == 1) {
      this.menus = this.menus.filter(d => d.code !== code);
      this.autoSaveAction();
      return;
    }
  }


  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, m: any): void {
    this.currentContextMenu = m;
    this.nzContextMenuService.create($event, menu);
  }

  openPropertyViewAction(obj: any): void {
    this.currentMenu = obj;
  }


  openFieldViewAction(obj?: any): void {
    this.validateFieldForm.reset();

    if (U.ObjectUtils.nonNull(obj)) {
      this.currentField = obj;
      this.validateFieldForm.get("code")?.setValue(obj.code)
      this.validateFieldForm.get("name")?.setValue(obj.name)
      this.validateFieldForm.get("type")?.setValue(obj.type)
      this.validateFieldForm.get("isQuery")?.setValue(obj.isQuery)
      this.validateFieldForm.get("value")?.setValue(obj.value)
    } else {
      this.currentField = null;
    }
    this.nzModalFieldBtnLoading = false;
    this.nzModalFieldVisible = true;
  }

  saveFieldAction(): void {
    for (const i in this.validateFieldForm.controls) {
      this.validateFieldForm.controls[i].markAsDirty();
      this.validateFieldForm.controls[i].updateValueAndValidity();
    }
    if (this.validateFieldForm.valid) {
      if (U.ObjectUtils.nonNull(this.currentField)) {

        // 更新模拟数据的code 字段
        if (this.currentField.code != this.validateFieldForm.get("code")?.value) {
          if (U.ObjectUtils.isNull(this.currentMenu.mocks)) {
            this.currentMenu.mocks = [];
          }
          // @ts-ignore
          this.currentMenu.mocks.forEach((m) => {
            // if (this.currentField.code in m) {
            if (m.hasOwnProperty(this.currentField)) {
              m[this.validateFieldForm.get("code")?.value] = m[this.currentField.code];
              delete m[this.currentField.code];
            }
          })
        }

        this.currentField.code = this.validateFieldForm.get("code")?.value;
        this.currentField.name = this.validateFieldForm.get("name")?.value;
        this.currentField.type = this.validateFieldForm.get("type")?.value;
        this.currentField.isQuery = this.validateFieldForm.get("isQuery")?.value;
        this.currentField.value = this.validateFieldForm.get("value")?.value;
      } else {
        if (U.ObjectUtils.isNull(this.currentMenu.fields)) {
          this.currentMenu.fields = [];
        }
        this.currentMenu.fields = [...this.currentMenu.fields, {
          "code": this.validateFieldForm.get("code")?.value,
          "name": this.validateFieldForm.get("name")?.value,
          "type": this.validateFieldForm.get("type")?.value,
          "isQuery": this.validateFieldForm.get("isQuery")?.value,
          "value": this.validateFieldForm.get("value")?.value
        }]
      }
      this.closeFieldViewAction();
      this.autoSaveAction();
    }
  }

  closeFieldViewAction(): void {
    this.validateFieldForm.reset();
    this.currentField = null;
    this.nzModalFieldVisible = false;
    this.nzModalFieldBtnLoading = false;
  }

  removeFieldAction(obj: any): void {
    // @ts-ignore
    this.currentMenu.fields = this.currentMenu.fields.filter(f => f.code !== obj.code);
    this.autoSaveAction();
  }


  openMockViewAction(obj?: any): void {
    this.validateMockForm = this.fb.group({});
    // @ts-ignore
    this.currentMenu.fields.forEach((f) => {
      if (f.isQuery) {
        this.validateMockForm.addControl(
          f.code,
          new UntypedFormControl(null, Validators.required)
        )
      } else {
        this.validateMockForm.addControl(
          f.code,
          new UntypedFormControl(null)
        )
      }
    })
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentMock = obj;
      // @ts-ignore
      this.currentMenu.fields.forEach((f) => {
        this.validateMockForm.get(f.code)?.setValue(obj[f.code]);
      })
    } else {
      this.currentField = null;
    }
    this.nzModalMockBtnLoading = false;
    this.nzModalMockVisible = true;
  }

  saveMockAction(): void {
    for (const i in this.validateMockForm.controls) {
      this.validateMockForm.controls[i].markAsDirty();
      this.validateMockForm.controls[i].updateValueAndValidity();
    }
    if (this.validateMockForm.valid) {
      if (U.ObjectUtils.nonNull(this.currentMock)) {
        // @ts-ignore
        this.currentMenu.fields.forEach((f) => {
          this.currentMock[f.code] = this.validateMockForm.get(f.code)?.value;
        })
      } else {
        if (U.ObjectUtils.isNull(this.currentMenu.mocks)) {
          this.currentMenu.mocks = [];
        }

        let data: any = {};
        // @ts-ignore
        this.currentMenu.fields.forEach((f) => {
          data[f.code] = this.validateMockForm.get(f.code)?.value;
        })
        this.currentMenu.mocks = [...this.currentMenu.mocks, data]
      }
      this.autoSaveAction();
      this.closeMockViewAction();
    }

  }

  closeMockViewAction(): void {
    this.validateMockForm.reset();
    this.currentMock = null;
    this.nzModalMockVisible = false;
    this.nzModalMockBtnLoading = false;
  }

  removeMackAction(i: any): void {
    this.currentMenu.mocks = Convert.deleteElementByIndex(this.currentMenu.mocks, i);
    this.autoSaveAction();
  }


  /* shell 数据添加 */
  appendMenus(menusString: string, textareaTtl: any): void {
    if (U.StringUtils.isBank(menusString)) {
      this.message.warning("不允许添加非空的功能菜单操作！");
      return;
    }

    try {
      menusString = Convert.recoveryJSON(menusString);

      let menusJSON: any[] = JSON.parse(menusString);
      let checkError = false;
      menusJSON.forEach((m) => {
        // if (!("code" in m)) {
        if (!m.hasOwnProperty("code")) {
          this.message.warning("json格式错误，缺少code值！");
          checkError = true;
        }
        if (!m.hasOwnProperty("name")) {
          this.message.warning("json格式错误，缺少name值！");
          checkError = true;
        }
        if (!m.hasOwnProperty("objective")) {
          this.message.warning("json格式错误，缺少objective值！");
          checkError = true;
        }
        if (!m.hasOwnProperty("children")) {
          // @ts-ignore
          m.children.forEach((cm) => {
            if (!m.hasOwnProperty("code")) {
              this.message.warning("json格式错误，缺少code值！");
              checkError = true;
            }
            if (!m.hasOwnProperty("name")) {
              this.message.warning("json格式错误，缺少name值！");
              checkError = true;
            }
            if (!m.hasOwnProperty("objective")) {
              this.message.warning("json格式错误，缺少objective值！");
              checkError = true;
            }
            delete cm.children;
          })
        }
      })

      if (checkError) {
        return;
      }
      this.menus = JSON.parse(menusString);
      this.message.info("菜单功能结构检测完整，已添加到缓存列表。")
      textareaTtl.value = "";
      this.autoSaveAction();
    } catch (e) {
      console.log(e);
      this.message.warning("解析失败，json格式错误！");
      return;
    }
  }

  appendFields(fieldsString: any, textareaTtl: any): void {
    if (U.StringUtils.isBank(fieldsString)) {
      this.message.warning("不允许添加非空操作！");
      return;
    }
    try {
      fieldsString = Convert.recoveryJSON(fieldsString);
      const fields: any[] = JSON.parse(fieldsString);
      if (fields.length == 0) {
        this.message.warning("不允许添加非空字段数据操作！");
        return;
      }
      let fieldsJSON: any[] = JSON.parse(fieldsString);
      let checkError = false;
      fieldsJSON.forEach((f) => {
        if (!f.hasOwnProperty("code")) {
          this.message.warning("json格式错误，缺少code值！");
          checkError = true;
        }
        if (!f.hasOwnProperty("name")) {
          this.message.warning("json格式错误，缺少name值！");
          checkError = true;
        }
        if (!f.hasOwnProperty("type")) {
          this.message.warning("json格式错误，缺少type值！");
          checkError = true;
        }
        if (!f.hasOwnProperty("isQuery")) {
          this.message.warning("json格式错误，缺少isQuery值！");
          checkError = true;
        }
      })
      if (checkError) {
        return;
      }

      this.currentMenu.fields = fields;
      this.message.info("菜单【" + this.currentMenu.name + "】的字段结构检测完整，已添加到缓存列表。")
      textareaTtl.value = "";
      this.autoSaveAction();
    } catch (e) {
      console.log(e);
      this.message.warning("解析失败，json格式错误！");
      return;
    }
  }

  appendMocks(mocksString: any, textareaTtl: any): void {
    if (U.StringUtils.isBank(mocksString)) {
      this.message.warning("不允许添加非空模拟数据操作！");
      return;
    }
    try {
      mocksString = Convert.recoveryJSON(mocksString);
      const mocks: any[] = JSON.parse(mocksString);
      if (mocks.length == 0) {
        this.message.warning("不允许添加非空模拟数据操作！");
        return;
      }

      let fieldsMap: any = {};
      // @ts-ignore
      this.currentMenu.fields.forEach((f) => {
        fieldsMap[f.code] = f;
      })

      let unnecessaryCodes: any[] = [];//多余的字段数据
      mocks.forEach((mock) => {
        Object.keys(mock).forEach(key => {
          // const value = mock[key];
          // console.log(`属性: ${key}, 值: ${value}`);
          if (!fieldsMap.hasOwnProperty(key)) {
            unnecessaryCodes = [...unnecessaryCodes, key]
          }
        });
      })

      if (unnecessaryCodes.length) {
        this.message.warning("出现非菜单字段属性的模拟数据，多余字段如下：" + JSON.stringify(unnecessaryCodes));
        return;
      }

      this.currentMenu.mocks = mocks
      this.message.info("菜单【" + this.currentMenu.name + "】的模拟数据结构检测完整，已添加到缓存列表。")
      textareaTtl.value = "";
      this.autoSaveAction();
    } catch (e) {
      console.log(e);
      this.message.warning("解析失败，json格式错误！");
      return;
    }
  }

  autoSaveAction(kernelStep: number = 0): void {
    // 提交数据
    const form: any = {};
    form.id = this.validateForm.get('id')?.value;
    form.codeup = JSON.stringify({menus: this.menus, kernelStep: kernelStep});// 表示草稿模式
    form.codeup = this.automaticErrorCorrect(form.codeup);
    const observable: Observable<R> = this.copyrightService.updateCodeupAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info("页面缓存数据,已保存进数据库内！");
        try {
          this.currentDataset.codeup = U.StringUtils.isBank(this.currentDataset.codeup) ? "{}" : this.currentDataset.codeup;
          let codeup: any = JSON.parse(this.currentDataset.codeup);
          Object.assign(codeup, JSON.parse(form.codeup));
          this.currentDataset.codeup = JSON.stringify(codeup);
          this.refreshEvent.emit(this.currentDataset);
        } catch (e) {
          console.error(e);
          this.message.error("保存数据库出错，请联系管理员查看！")
        }
      }
    });
  }

  clickCopyMenusCommand(): void {
    // let menusCommand: any = this.parameters['copyright_menu_command']
    // if (U.ObjectUtils.isNull(menusCommand)) {
    //   this.message.warning("无效的文本复制命令");
    //   return;
    // }
    // let textCommand = menusCommand.val;
    //
    // const cnName: any = this.currentDataset.name;
    // textCommand = textCommand.replace('%cnName', cnName);
    // const pRandomCount = Convert.randomNumber(5, 9);
    // textCommand = textCommand.replace('%pRandomCount', pRandomCount);
    // const randomCount = Convert.randomNumber(3, 5);
    // textCommand = textCommand.replace('%randomCount', randomCount);
    const textCommand = this.getMenusTextCommand();
    if (U.StringUtils.isNotBank(textCommand)) {
      this.webCommandService.clickCopyTextCommand(textCommand, "复制生成软件功能的命令成功");
    }
  }

  getMenusTextCommand(): string {
    let menusCommand: any = this.parameters['copyright_menu_command']
    if (U.ObjectUtils.isNull(menusCommand)) {
      this.message.warning("无效的文本复制命令");
      return "";
    }
    let textCommand = menusCommand.val;

    const cnName: any = this.currentDataset.name;
    textCommand = textCommand.replace('%cnName', cnName);
    const pRandomCount = Convert.randomNumber(5, 9);
    textCommand = textCommand.replace('%pRandomCount', pRandomCount);
    const randomCount = Convert.randomNumber(3, 5);
    textCommand = textCommand.replace('%randomCount', randomCount);
    return textCommand;
  }

  showCopyMenusCommandTips(): string {
    if (U.StringUtils.isBank(this.copyright_mock_command)) {
      return "点击复制，生成软件功能的命令";
    }
    return "点击复制，模版如下：" + this.copyright_mock_command;
  }

  clickCopyFieldsCommand(): void {
    // let fieldsCommand: any = this.parameters['copyright_field_command']
    // if (U.ObjectUtils.isNull(fieldsCommand)) {
    //   this.message.warning("无效的文本复制命令")
    //   return;
    // }
    // let textCommand = fieldsCommand.val;
    //
    // let content: any = {
    //   "code": this.currentMenu.code,
    //   "name": this.currentMenu.name,
    //   "objective": this.currentMenu.objective
    // }
    // textCommand = textCommand.replace('%menuInfo', JSON.stringify(content));
    // const randomCount = Convert.randomNumber(6, 10);
    // textCommand = textCommand.replace('%randomCount', randomCount);
    const textCommand = this.getFieldsTextCommand();
    if (U.StringUtils.isNotBank(textCommand)) {
      this.webCommandService.clickCopyTextCommand(textCommand, "复制生成菜单字段属性的命令成功");
    }
  }

  getFieldsTextCommand(): string {
    let fieldsCommand: any = this.parameters['copyright_field_command']
    if (U.ObjectUtils.isNull(fieldsCommand)) {
      this.message.warning("无效的文本复制命令")
      return "";
    }
    let textCommand = fieldsCommand.val;

    let content: any = {
      "code": this.currentMenu.code,
      "name": this.currentMenu.name,
      "objective": this.currentMenu.objective
    }
    textCommand = textCommand.replace('%menuInfo', JSON.stringify(content));
    const randomCount = Convert.randomNumber(6, 10);
    textCommand = textCommand.replace('%randomCount', randomCount);
    return textCommand;
  }

  showCopyFieldCommandTips(): string {
    if (U.StringUtils.isBank(this.copyright_field_command)) {
      return "点击复制，生成菜单字段属性的命令";
    }
    return "点击复制，模版如下：" + this.copyright_field_command;
  }

  clickCopyMocksCommand(): void {
    // let mocksCommand: any = this.parameters['copyright_mock_command']
    // if (U.ObjectUtils.isNull(mocksCommand)) {
    //   this.message.warning("无效的文本复制命令")
    //   return;
    // }
    //
    // let textCommand = mocksCommand.val;
    // textCommand = textCommand.replace('%menuObjective', this.currentMenu.objective);
    //
    // let fields: any = [];
    // // @ts-ignore
    // this.currentMenu.fields.forEach((f) => {
    //   fields = [...fields, {
    //     "code": f.code,
    //     "name": f.name,
    //     "type": f.type
    //   }]
    // })
    //
    // textCommand = textCommand.replace('%fields', JSON.stringify(fields));
    // const randomCount = Convert.randomNumber(4, 8);
    // textCommand = textCommand.replace('%randomCount', randomCount);

    const textCommand = this.getMocksTextCommand();
    if (U.StringUtils.isNotBank(textCommand)) {
      this.webCommandService.clickCopyTextCommand(textCommand, "复制生成菜单模拟数据的命令成功");
    }
  }

  getMocksTextCommand(): string {
    let mocksCommand: any = this.parameters['copyright_mock_command']
    if (U.ObjectUtils.isNull(mocksCommand)) {
      this.message.warning("无效的文本复制命令")
      return "";
    }

    let textCommand = mocksCommand.val;
    textCommand = textCommand.replace('%menuObjective', this.currentMenu.objective);

    let fields: any = [];
    // @ts-ignore
    this.currentMenu.fields.forEach((f) => {
      fields = [...fields, {
        "code": f.code,
        "name": f.name,
        "type": f.type
      }]
    })

    textCommand = textCommand.replace('%fields', JSON.stringify(fields));
    const randomCount = Convert.randomNumber(4, 8);
    textCommand = textCommand.replace('%randomCount', randomCount);
    return textCommand;
  }

  showCopyMockCommandTips(): string {
    if (U.StringUtils.isBank(this.copyright_mock_command)) {
      return "点击复制，生成菜单模拟数据的命令";
    }
    return "点击复制，模版如下：" + this.copyright_mock_command;
  }


  openCodeTestViewAction(): void {
    const component = this.dynamicComponentContainer!.createComponent(CopyrightAutoConsoleComponent);
    // 获取动态组件实例并调用方法
    const dynamicComponentInstance = component.instance as CopyrightAutoConsoleComponent;
    dynamicComponentInstance.openViewAction(this.currentDataset);
    // 监听关闭事件
    dynamicComponentInstance.closeEvent.subscribe(() => {
      this.dynamicComponentContainer!.remove();
    });
    // 坚挺测试结果
    dynamicComponentInstance.callbackTestResultEvent.subscribe((event) => {
      let kernelStep: number = event ? 1 : 0;
      this.autoSaveAction(kernelStep);
    });
  }

  /**
   * 自动错误纠正
   */
  automaticErrorCorrect(obj: string): string {
    const codeup: any = JSON.parse(obj);
    //
    let menus: any[] = codeup.menus;
    if (U.CollectionUtils.isEmpty(menus)) {
      return JSON.stringify(codeup);
    }

    for (let pMenu of menus) {
      if (U.CollectionUtils.isEmpty(pMenu.children)) {
        continue;
      }

      for (let menu of pMenu.children) {
        if (U.CollectionUtils.isEmpty(menu.mocks)) {
          continue;
        }
        const fields: any = {};
        menu.fields.forEach((f: any) => {
          fields[f.code] = f;
        })

        menu.mocks.forEach((mock: any) => {
          let unnecessaryCodes: any[] = [];//多余的字段数据
          Object.keys(mock).forEach(key => {
            if (!fields.hasOwnProperty(key)) {
              unnecessaryCodes = [...unnecessaryCodes, key]
            }
          });
          // 删除冗余字段。
          unnecessaryCodes.forEach((code) => {
            delete mock[code];
          })
        })
      }
    }
    return JSON.stringify(codeup);
  }

  autoGenerateMenusAction(): void {
    const textCommand = this.getMenusTextCommand();
    if (U.StringUtils.isBank(textCommand)) {
      return;
    }

    this.isSpinning = true;
    let form: any = {};
    form.type = 0;
    form.message = textCommand;
    // 调用gpt 然后处理数据
    const observable: Observable<R> = this.robotScriptService.conversation(form);
    observable.subscribe((data) => {
      this.isSpinning = false;
      if (R.isSuccess(data)) {
        try {
          this.currentMenu = {};
          this.menus = JSON.parse(data.t);
          this.message.success("AI自动生成完成，如果菜单没有刷新，请重新搜索列表后再次点击打开！")
          this.autoSaveAction();
        } catch (e) {
          this.message.warning("解析失败，json格式错误！");
          return;
        }
      }
    });
  }

  autoGenerateFieldsAction(): void {
    const textCommand = this.getFieldsTextCommand();
    if (U.StringUtils.isBank(textCommand)) {
      return;
    }

    this.isSpinning = true;
    let form: any = {};
    form.type = 0;
    form.message = textCommand;
    // 调用gpt 然后处理数据
    const observable: Observable<R> = this.robotScriptService.conversation(form);
    observable.subscribe((data) => {
      this.isSpinning = false;
      if (R.isSuccess(data)) {
        try {
          this.currentMenu.fields = JSON.parse(data.t);
          this.currentMenu.mocks = {};
          this.message.success("AI自动生成完成，如果字段没有刷新，请重新重新点击菜单查看！")
          this.autoSaveAction();
        } catch (e) {
          this.message.warning("解析失败，json格式错误！");
          return;
        }
      }
    });
  }

  autoGenerateMocksAction(): void {
    const textCommand = this.getMocksTextCommand();
    if (U.StringUtils.isBank(textCommand)) {
      return;
    }

    this.isSpinning = true;
    let form: any = {};
    form.type = 0;
    form.message = textCommand;
    // 调用gpt 然后处理数据
    const observable: Observable<R> = this.robotScriptService.conversation(form);
    observable.subscribe((data) => {
      this.isSpinning = false;
      if (R.isSuccess(data)) {
        try {
          this.currentMenu.mocks = JSON.parse(data.t);
          this.message.success("AI自动生成完成，如果模拟数据没有刷新，请点击菜单重新刷新！")
          this.autoSaveAction();
        } catch (e) {
          this.message.warning("解析失败，json格式错误！");
          return;
        }
      }
    });
  }
}
