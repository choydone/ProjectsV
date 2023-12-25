import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule} from '@angular/router';
import {StatusComponent} from "./widgets/elements/status/status.component";
import {NzTagModule} from "ng-zorro-antd/tag";
import {DistrictComponent} from "./widgets/controls/district/district.component";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzSelectModule} from "ng-zorro-antd/select";
import {UploadComponent} from "./widgets/controls/upload/upload.component";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzIconModule} from "ng-zorro-antd/icon";
import {IconsComponent} from "./widgets/controls/icons/icons.component";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {AvatarComponent} from "./widgets/elements/avatar/avatar.component";
import {NzImageModule} from "ng-zorro-antd/image";
import {TagComponent} from "./widgets/controls/tag/tag.component";
import {NzNoAnimationModule} from "ng-zorro-antd/core/no-animation";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NativeService} from "./shared/native.service";
import {NzMessageModule} from "ng-zorro-antd/message";
import {RobotTableDirective} from "./directive/robot-table.directive";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {BadgeComponent} from "./widgets/elements/badge/badge.component";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {CheckboxComponent} from "./widgets/controls/checkbox/checkbox.component";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {UploadMultipleComponent} from "./widgets/controls/upload-multiple/upload-multiple.component";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {TooltipQuestionComponent} from "./widgets/tooltip/tooltip-question/tooltip-question.component";
import {TagsComponent} from "./widgets/tags/tags/tags.component";
import {CodeEditorComponent} from './widgets/controls/code-editor/code-editor.component';
import {CodeEditorModule} from '@ngstack/code-editor';
import {NzRadioModule} from "ng-zorro-antd/radio";
import {PipesModule} from "./pipes/pipes.module";
import {IconComponent} from "./widgets/elements/icon/icon.component";
import {EnumSelectComponent} from "./widgets/controls/enums/enum-select/enum-select.component";
import {EnumRadioComponent} from "./widgets/controls/enums/enum-radio/enum-radio.component";
import {TooltipComponent} from "./widgets/elements/tooltip/tooltip.component";
import {DocEasyComponent} from "./widgets/controls/doc/doc-easy/doc-easy.component";
import {EnumCheckboxComponent} from "./widgets/controls/enums/enum-checkbox/enum-checkbox.component";
import {DocSingleCardComponent} from "./widgets/controls/doc/doc-single-card/doc-single-card.component";
import {DownloadComponent} from "./widgets/elements/download/download.component";
import {AutocompleteEasyComponent} from "./widgets/controls/auto/autocomplete-easy/autocomplete-easy.component";
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzMessageModule,
    NzTagModule,
    NzSpaceModule,
    NzSelectModule,
    NzUploadModule,
    NzModalModule,
    NzIconModule,
    NzDropDownModule,
    NzButtonModule,
    NzInputModule,
    NzImageModule,
    NzNoAnimationModule,
    NzPaginationModule,
    NzSpinModule,
    NzBadgeModule,
    NzCheckboxModule,
    NzToolTipModule,
    CodeEditorModule.forRoot(),
    NzRadioModule,
    PipesModule,
    NgOptimizedImage,
    NzAutocompleteModule
  ],
  providers: [
    NativeService
  ],
  declarations: [StatusComponent, DistrictComponent, UploadComponent, AutocompleteEasyComponent,
    DocSingleCardComponent, IconsComponent, AvatarComponent, TagComponent, BadgeComponent,
    RobotTableDirective, CheckboxComponent, UploadMultipleComponent, TooltipComponent, TooltipQuestionComponent,
    IconComponent, TagsComponent, CodeEditorComponent, DownloadComponent,
    EnumSelectComponent, EnumRadioComponent, EnumCheckboxComponent, DocEasyComponent],
  exports: [StatusComponent, DistrictComponent, UploadComponent, AutocompleteEasyComponent,
    DocSingleCardComponent, IconsComponent, AvatarComponent, TagComponent, BadgeComponent,
    RobotTableDirective, CheckboxComponent, UploadMultipleComponent, TooltipComponent, TooltipQuestionComponent,
    IconComponent, TagsComponent, CodeEditorComponent, DownloadComponent,
    EnumSelectComponent, EnumRadioComponent, EnumCheckboxComponent, DocEasyComponent]
})
export class StarterModule {
}
