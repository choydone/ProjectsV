import {Component, forwardRef, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NativeService} from "../../../shared/native.service";
import {U} from "../../../utils/utils";

@Component({
    selector: 'app-district',
    templateUrl: './district.component.html',
    styleUrls: ['./district.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DistrictComponent),
            multi: true
        }
    ]
})
export class DistrictComponent implements ControlValueAccessor, OnInit {
    province: any;
    city: any;
    area: any;

    provinces: any[] = [];
    cities: any[] = [];
    areas: any[] = [];

    // tslint:disable-next-line:variable-name
    _counterValue = 0;
    private onChange = (_: any) => {
    };

    constructor(private nativeService: NativeService) {
    }

    ngOnInit(): void {
        const observable: Observable<any> = this.nativeService.searchAtTree({});
        observable.subscribe((data) => {
            this.provinces = data.t;
            if (U.StringUtils.isNotBank(this.province)) {
                this.provinces.forEach((province) => {
                    if (province.name === this.province) {
                        if (province.name.search('市') != -1) {
                            this.cities = [province];
                            return;
                        }
                        this.cities = province.children;
                    }
                });
            }
            if (U.StringUtils.isNotBank(this.city)) {
                this.cities.forEach((city) => {
                    if (city.name === this.city) {
                        this.areas = city.children;
                    }
                });
            }
            if (U.StringUtils.isNotBank(this.area)) {
                this.counterValue = this.province + ',' + this.city + ',' + this.area;
            }
        });
    }

    get counterValue(): any {
        return this._counterValue;
    }

    set counterValue(value) {
        this._counterValue = value;
        // 触发 onChange，component 内部的值同步到 form model
        this.onChange(this._counterValue);
    }


    selectedProvinceAction(event: any): void {
        this.counterValue = '';
        this.city = null;
        this.area = null;
        this.provinces.forEach((province) => {
            if (province.name === event) {
                if (province.name.search('市') != -1) {
                    this.cities = [province];
                    return;
                }
                this.cities = province.children;
            }
        });
        // this.counterValue = this.province;
    }

    selectedCityAction(event: any): void {
        this.counterValue = '';
        this.area = null;
        this.cities.forEach((city) => {
            if (city.name === event) {
                this.areas = city.children;
            }
        });
        // this.counterValue = this.province + ',' + this.city;
    }

    selectedAreaAction(event: any): void {
        this.counterValue = this.province + ',' + this.city + ',' + this.area;
    }


    registerOnChange(fn: any): void {
        this.onChange = fn; // 保存这个函数
    }

    registerOnTouched(fn: any): void {
        // this.onTouched = fn; // 保存这个函数
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
        // this.value = obj; // form中给你设置了obj值，根据obj，去更新组件/UI
        this.counterValue = obj;
        if (U.StringUtils.isNotBank(obj)) {
            const district = obj.split(',');

            if (district.length >= 1) {
                this.province = district[0];
                this.selectedProvinceAction(this.province);
            }

            if (district.length >= 2) {
                this.city = district[1];
                this.selectedCityAction(this.city);
            }

            if (district.length >= 3) {
                this.area = district[2];
                this.selectedAreaAction(this.area);
            }
        }
    }

    /**
     * 自定义当组件发生改变时，会调用的方法
     */
    /*  onChange = (_: any) => {
        // this.value = payload;
         this.onChangeListener(payload); // 告诉form，你的表单值改变成了payload
        // this.onTouchedListener(); // 告诉form，你的表单有交互发生
      };*/

}
