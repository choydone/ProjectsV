import {Component, Input} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {BaseComponent} from "../../../../base.component";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {SecurityService} from "../../../../../starter/shared/security-service";
import {WebCommandService} from "../../../../../starter/shared/web-command-service";

@Component({
  selector: 'app-pre-regular-list',
  templateUrl: './pre-regular-list.component.html',
  styleUrls: ['./pre-regular-list.component.scss']
})
export class PreRegularListComponent extends BaseComponent {

  @Input() data: string = "";


  codeParser: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private message: NzMessageService,
              securityService: SecurityService, webCommandService: WebCommandService) {
    super(securityService, webCommandService);
  }


  override ngOnInit(): void {

  }

  /**
   *  订单确认操作
   */
  openViewAction(): void {
    try {
      this.codeParser = JSON.parse(this.data) ;
      if (!(this.codeParser instanceof Array)) {
        this.codeParser = [];
      }
    } catch (e) {
      console.log(e);
      this.codeParser = [];
      return;
    }
  }

}
