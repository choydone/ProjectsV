import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {LayoutRoutingModule} from './layout.routing';
import {LayoutComponent} from './layout.component';
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzButtonModule} from "ng-zorro-antd/button";
import {HeaderComponent} from "./components/header/header.component";
import {ToolBarComponent} from "./components/tool-bar/tool-bar.component";
import {HeadRightMenuComponent} from "./components/head-right-menu/head-right-menu.component";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NoticeComponent} from "./components/notice/notice.component";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzListModule} from "ng-zorro-antd/list";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {StarterModule} from "../../starter/starter.module";
import {NzResultModule} from "ng-zorro-antd/result";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzImageModule} from "ng-zorro-antd/image";
import {PipesModule} from "../../starter/pipes/pipes.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LayoutRoutingModule,
        ReactiveFormsModule,
        RouterModule,
        NzLayoutModule,
        NzMenuModule,
        NzIconModule,
        NzBreadCrumbModule,
        NzButtonModule,
        NzDropDownModule,
        NzBadgeModule,
        NzCardModule,
        NzTabsModule,
        NzListModule,
        NzTagModule,
        NzTypographyModule,
        StarterModule,
        NzResultModule,
        NzModalModule,
        NzFormModule,
        NzInputModule,
        NzDrawerModule,
        NzImageModule,
        PipesModule
    ],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    ToolBarComponent,
    HeadRightMenuComponent,
    NoticeComponent,
  ],
  providers: [],
  exports: [LayoutComponent, HeaderComponent,
    ToolBarComponent, HeadRightMenuComponent,
    NoticeComponent
  ]
})
export class LayoutModule {
}
