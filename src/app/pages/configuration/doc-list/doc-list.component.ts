import {Component} from '@angular/core';
import {Tree} from "../../../starter/elements/table/tree";
import {BaseComponent} from "../../base.component";
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityService} from "../../../starter/shared/security-service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzFormatEmitEvent, NzTreeNode} from "ng-zorro-antd/tree";
import {P, R, U} from "../../../starter/utils/utils";
import {DocumentService} from "../../../shared/worksheet/document.service";
import {Observable} from "rxjs";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzModalService} from "ng-zorro-antd/modal";
import {Pagination} from "../../../starter/utils/pagination";
import {WebCommandService} from "../../../starter/shared/web-command-service";

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent extends BaseComponent {
  type: any = -1;
  tree!: Tree;
  searchValue = '';
  // 菜单数据
  nodes: any[] = [];

  currentContextMenu: any = {};

  currentClickMenusIds: any[] = [];
  currentTableTitle = "";
  currentClickMenuNode: any = {};

  // 分页参数
  pagination: Pagination = new Pagination();
  // 表格加载标志
  nzTableLoading = false;


  // 弹框显示标志
  nzModalVisible = false;
  // 弹框内按钮loading标志
  nzModalBtnLoading = false;
  // 表单
  validateForm!: UntypedFormGroup;

  // 弹框显示标志
  nzModalFileVisible = false;
  // 弹框内按钮loading标志
  nzModalFileBtnLoading = false;
  // 表单
  validateFileForm!: UntypedFormGroup;
  currentAction: any = this.add;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
              private message: NzMessageService, securityService: SecurityService,
              private documentService: DocumentService, private nzContextMenuService: NzContextMenuService,
              private modal: NzModalService, webCommandService: WebCommandService) {
    super(securityService, webCommandService);
    this.route.params.subscribe(params => {
      this.type = params['type']; // 获取参数值
    });

    this.tree = new Tree();
    /**
     * 树点击事件 - 重写默认的点击事件
     */
    this.tree.clickTplTreeEvent = (node: NzTreeNode) => {
      try {
        // 获取对应集合下的所有ID
        this.currentClickMenusIds = this.tree.tplTreeNodeIdLs(node);
      } catch (e) {
        // 一般不会出现异常，防止后端程序修改前端报错
      }
      this.currentTableTitle = "[列表] 所属节点【" + node.title + "】的文件列表~";
      this.currentClickMenuNode = node.origin;
      this.search(true);
    }
  }

  override ngOnInit(): void {

    this.validateForm = this.fb.group({
      id: [null],
      title: [null, [Validators.required]],
      parentId: [null, [Validators.required]],
      parentTitle: [null],
      sorter: [null, [Validators.required]]
    });

    this.validateFileForm = this.fb.group({
      id: [null],
      title: [null, [Validators.required]],
      src: [null, [Validators.required]],
      parentId: [null, [Validators.required]],
      parentTitle: [null],
      status: [null, [Validators.required]],
      remarks: [null],
      fileType: [null]
    });


    this.search(true);
    this.searchTree();
  }

  search(reset: boolean = false): void {
    if (this.currentClickMenusIds.length == 0) {
      this.pagination.reset();
      return;
    }
    if (reset) {
      this.pagination.reset();
    }
    // 获取基础数据-分页数据
    const query: any = this.pagination.query();
    // 表单数据
    query.searchValue = this.tplSearchValue
    if (!this.tplStatus) {
      // 未选中全部，则显示正常可用的
      query.status = 20;
    }
    if (this.currentClickMenusIds.length > 0) {
      query.parentIdLs = this.currentClickMenusIds;
    }
    query.type = 20;
    this.nzTableLoading = true;
    const observable: Observable<R> = this.documentService.searchAtPage(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.pagination.fill(data);
      }
      this.nzTableLoading = false;
    });
  }

  /**
   * 查询列表
   */
  searchTree(): void {
    const query: any = {};
    query.type = this.type;
    query.status = 20;
    const observable: Observable<R> = this.documentService.searchAtTree(query);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.nodes = data.t;
      }
    });
  }

  contextMenu(event: NzFormatEmitEvent, menu: NzDropdownMenuComponent): void {
    this.currentContextMenu = event.node;
    // @ts-ignore
    this.nzContextMenuService.create(event.event, menu);
  }

  addSubNodeAction(): void {
    const node = this.currentContextMenu.origin;
    this.openViewAction({id: node.id, title: node.title});
  }

  editNodeAction(): void {
    const node = this.currentContextMenu.origin;
    this.validateForm.reset();
    this.validateForm.get("id")?.setValue(node.id)
    this.validateForm.get("title")?.setValue(node.title)
    if (node.parentId == 0) {
      this.validateForm.get("parentId")?.setValue(0)
      this.validateForm.get("parentTitle")?.setValue("根节点")
    } else {
      const parentNode = this.currentContextMenu.parentNode.origin;
      this.validateForm.get("parentId")?.setValue(parentNode.id)
      this.validateForm.get("parentTitle")?.setValue(parentNode.title)
    }

    this.validateForm.get("sorter")?.setValue(node.sorter);
    this.nzModalBtnLoading = false;
    this.nzModalVisible = true;
  }

  deleteNodeAction(): void {
    const node = this.currentContextMenu.origin;
    this.modal.confirm({
      nzTitle: '<i>' + node.title + '</i>',
      nzContent: '<b>是否确认删除节点记录，删除同时将会把子节点同步删除?</b>',
      nzOnOk: () => {
        const idLs = this.tree.tplTreeNodeIdLs(this.currentContextMenu);
        this.removeNodeAction(idLs)
      }
    });
  }

  /**
   * 关闭窗口事件
   */
  openViewAction(pObj?: any): void {
    this.validateForm.reset();
    if (U.ObjectUtils.nonNull(pObj)) {
      this.validateForm.get("parentId")?.setValue(pObj.id)
      this.validateForm.get("parentTitle")?.setValue(pObj.title)
      this.validateForm.get("sorter")?.setValue(100);
    } else {
      this.validateForm.get("parentId")?.setValue(0)
      this.validateForm.get("parentTitle")?.setValue("根节点")
      this.validateForm.get("sorter")?.setValue(100);
    }
    this.nzModalBtnLoading = false;
    this.nzModalVisible = true;
  }

  closeNodeViewAction(): void {
    this.validateForm.reset();
    this.nzModalVisible = false;
    this.nzModalBtnLoading = false;
  }

  /**
   * 保存事件
   */
  saveNodeAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      this.nzModalBtnLoading = true;
      // 提交数据
      const form: any = {};
      const id = this.validateForm.get('id')?.value;
      if (U.NumberUtils.nonNull(id)) {
        form.id = id;
      }

      form.title = this.validateForm.get('title')?.value;
      form.parentId = this.validateForm.get('parentId')?.value;
      form.type = this.type;
      form.sorter = this.validateForm.get('sorter')?.value
      const observable: Observable<R> = this.documentService.saveNodeAction(form);
      observable.subscribe((data) => {
        this.nzModalBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.searchTree();
          this.closeNodeViewAction();
        }
      });
    }
  }

  /**
   * 删除事件
   */
  removeNodeAction(idLs: any[]): void {
    const form: any = {};
    form.idLs = idLs;
    const observable: Observable<R> = this.documentService.removeNodeAction(form);
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.searchTree();
      }
    });
  }


  removeAction(obj: any): void {
    this.nzTableLoading = true;
    const observable: Observable<R> = this.documentService.removeAction(obj);
    observable.subscribe((data) => {
      this.nzTableLoading = false;
      if (R.isSuccess(data)) {
        this.message.info(data.t);
        this.search(true);
      }
    });
  }

  openFileAction(obj?: any): void {
    this.validateFileForm.reset();
    if (U.ObjectUtils.nonNull(obj)) {
      this.currentAction = this.edit;
      this.validateFileForm.get('id')?.setValue(obj.id);
      this.validateFileForm.get('title')?.setValue(obj.title);
      this.validateFileForm.get('src')?.setValue(obj.src);
      this.validateFileForm.get('parentId')?.setValue(obj.parentId);
      this.validateFileForm.get('parentTitle')?.setValue(obj.parentTitle);

      this.validateFileForm.get('remarks')?.setValue(obj.remarks);
      this.validateFileForm.get('fileType')?.setValue(obj.fileType);
      const status = obj.status === 20;
      this.validateFileForm.get('status')?.setValue(status);
    } else {
      this.currentAction = this.add;
      this.validateFileForm.get('status')?.setValue(20);
      this.validateFileForm.get('parentId')?.setValue(this.currentClickMenuNode.id);
      this.validateFileForm.get('parentTitle')?.setValue(this.currentClickMenuNode.title);
    }
    this.nzModalFileVisible = true;
    this.nzModalFileBtnLoading = false;
  }

  saveFileAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateFileForm.controls) {
      this.validateFileForm.controls[i].markAsDirty();
      this.validateFileForm.controls[i].updateValueAndValidity();
    }

    if (this.validateFileForm.valid) {
      this.nzModalBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.id = this.validateFileForm.get('id')?.value;
      form.title = this.validateFileForm.get('title')?.value;
      form.src = this.validateFileForm.get('src')?.value;
      form.parentId = this.validateFileForm.get('parentId')?.value;
      form.type = 20;
      form.status = this.validateFileForm.get('status')?.value;
      form.remarks = P.preText(this.validateFileForm.get('remarks')?.value);
      form.fileType = P.preText(this.validateFileForm.get('fileType')?.value);
      form.status = this.validateFileForm.get('status')?.value;
      form.status = form.status ? '20' : '30';

      const observable: Observable<R> = this.documentService.saveAction(form);
      observable.subscribe((data) => {
        this.nzModalBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.search();
          this.closeFileViewAction();
        }
      });
    }
  }

  closeFileViewAction(): void {
    this.validateFileForm.reset();
    this.nzModalFileVisible = false;
    this.nzModalFileBtnLoading = false;
  }

  /**
   * 显示数据记录
   */
  override tplCheckedStatus(event: any): void {
    super.tplCheckedStatus(event);
    this.search();
  }
}
