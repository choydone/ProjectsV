import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable} from 'rxjs';
import {Pagination} from "../../../utils/pagination";
import {IconService} from "../../../shared/icon.service";
import {R, U} from "../../../utils/utils";

@Component({
    selector: 'app-icons',
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IconsComponent),
            multi: true
        }
    ]
})
export class IconsComponent implements ControlValueAccessor, OnInit {
    // 分页参数
    pagination: Pagination = new Pagination();
    // 表格加载标志
    nzDataLoading = false;

    searchValue = '';
    iconfont: any = 'line-chart';
    isCollapsed = false;

    // tslint:disable-next-line:variable-name
    _counterValue = 'line-chart';

    icons: any[] = [];

    // 当前点击记录
    currentClickRecord: any = {};

    private onChange = (_: any) => {
    };

    constructor(private iconService: IconService) {
    }

    ngOnInit(): void {
        this.search(true)
    }

    get counterValue(): any {
        return this._counterValue;
    }

    set counterValue(value) {
        if (U.StringUtils.isBank(value)) {
            value = 'yuque';
        }
        this._counterValue = value;
        this.iconfont = value;
        // 触发 onChange，component 内部的值同步到 form model
        this.onChange(this._counterValue);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn; // 保存这个函数
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
        this.counterValue = obj;
        if (U.StringUtils.isNotBank(obj)) {
            let query: any = {}
            query.code = obj;
            const observable: Observable<R> = this.iconService.getByCode(query);
            observable.subscribe((data) => {
                if (R.isSuccess(data)) {
                    this.currentClickRecord = data.t;
                }
            });
        }
    }

    clickIcon(icon: any, data: any): void {
        this.currentClickRecord = data
        this.isCollapsed = !this.isCollapsed;
        this.counterValue = icon;
    }

    // search(): void {
    //   if (StringUtils.isBank(this.searchValue)) {
    //     this.iconsView = this.icons;
    //   }
    //   this.iconsView = [];
    //   this.icons.forEach((icon) => {
    //     if (icon.code.split(this.searchValue).length > 1 || icon.name.split(this.searchValue).length > 1) {
    //       // arr.push(list[i]);
    //       this.iconsView = [...this.iconsView, icon];
    //     }
    //   });
    // }

    search(reset: boolean = false): void {
        if (reset) {
            this.pagination.reset();
        }
        // 获取基础数据-分页数据
        const query: any = this.pagination.query();
        // 表单数据
        query.searchValue = this.searchValue
        this.nzDataLoading = true;
        const observable: Observable<R> = this.iconService.searchAtPage(query);
        observable.subscribe((data) => {
            if (R.isSuccess(data)) {
                this.pagination.fill(data);
            }
            this.nzDataLoading = false;
        });
    }


    /**
     * 上一页
     */
    prevAction(): void {
        if (this.pagination.current == 1) {
            return;
        }

        this.pagination.current = this.pagination.current - 1;

        this.search()
    }

    /**
     * 下一页
     */
    nextAction(): void {
        if (this.pagination.current == this.pagination.pages) {
            return;
        }

        this.pagination.current = this.pagination.current + 1;

        this.search()
    }
}
