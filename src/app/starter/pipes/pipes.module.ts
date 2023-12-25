import {NgModule} from '@angular/core';
import {ColorsPipe} from "./colors.pipe";
import {DocStylePipe} from "./doc-style.pipe";
import {NumberLoopPipe} from "./number-loop.pipe";
import {SplitCountPipe} from "./split-count.pipe";

@NgModule({
  imports: [],
  providers: [],
  declarations: [ColorsPipe, DocStylePipe, NumberLoopPipe, SplitCountPipe],
  exports: [ColorsPipe, DocStylePipe, NumberLoopPipe, SplitCountPipe]
})
export class PipesModule {
}
