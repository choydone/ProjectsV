import {
    Directive,
    ElementRef,
    Host,
    Optional,
    ViewContainerRef,
} from '@angular/core';

import {NzNoAnimationDirective} from "ng-zorro-antd/core/no-animation";

@Directive({                    // @Directive 是指令的装饰器
    selector: '[robotTable]'  // 是在模板中使用的指令名
})
export class RobotTableDirective {
    constructor(
        private elementRef: ElementRef,
        hostView: ViewContainerRef,
        @Host() @Optional() noAnimation?: NzNoAnimationDirective
    ) {
        this.execute();
    }

    execute(): void {
        setTimeout(() => {
            const tableElement: any = this.elementRef.nativeElement;
            const element: any = tableElement.querySelector("table");
            const tbodyElement: any = element.querySelector("tbody")
            const tdElements: any = tbodyElement.getElementsByClassName("ant-table-cell");
            Array.from(tdElements).forEach((el) => {
                let tdElement = el as any;
                let childOffsetWidth = this.calcTextWidth(tdElement.innerText);
                let offsetWidth = tdElement.offsetWidth - 16;
                if (childOffsetWidth > offsetWidth) {
                    // 这里自定义一个提示框否则
                    tdElement.setAttribute('title', tdElement.innerText);

                }
                console.log(tdElement.innerText)
                console.log(childOffsetWidth +"--"+ offsetWidth)
            });
        }, 200)
    }


    calcTextWidth(text: any) {
        let canvas: any = document.createElement("canvas");
        let context: any = canvas.getContext("2d");
        context.font = "15px;" + " " + "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';";
        let result = context.measureText(text);
        return result.width
    }
}
