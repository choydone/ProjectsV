export class Checkbox {

    tplCheckboxWidth: string = "40px";// 表格选中框默认宽度

    /**
     * 表格选中框 -- 只支持单个。出现多个需要单独设置开发
     * <p>数据集必须有ID 作为唯一标识符</p>
     */
    _checked = false;
    _indeterminate = false;
    private _currentData: Array<any> = [];
    private _setCheckedId = new Set<number>();

    /** *************************************************************
     *  表格常用方法集合
     * *************************************************************/

    /**
     * 初始化数据
     */
    initData(data: Array<any>, isClearChecked: boolean = true): void {
        this._currentData = data;
        if (isClearChecked) {
            this._setCheckedId.clear();
        }
        this._checked = false;
        this.refreshCheckedStatus();
    }

    /**
     * 表格选中框的操作方法
     */
    onAllChecked(value: boolean): void {
        this._currentData.forEach(item => this.updateCheckedSet(item.id, value));
        this.refreshCheckedStatus();
    }

    refreshCheckedStatus(): void {
        if (this._currentData.length == 0) {
            this._checked = false;
        } else {
            this._checked = this._currentData.every(item => this._setCheckedId.has(item.id));
        }
        this._indeterminate = this._currentData.some(item => this._setCheckedId.has(item.id)) && !this._checked;
    }

    onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this._setCheckedId.add(id);
        } else {
            this._setCheckedId.delete(id);
        }
    }

    /**
     * 判断是否未选中任何记录
     */
    isTplEmpty(): boolean {
        return this._setCheckedId.size == 0;
    }

    /**
     * 获取当前选中的ID集
     */
    getCurrentCheckedData(): Array<any> {
        let idLs: Array<any> = [];
        this._setCheckedId.forEach((id) => {
            idLs = [...idLs, id];
        })
        return idLs;
    }

    /**
     * 获取当前选中的ID集
     */
    getCurrentCheckedDataString(): string {
        let idLs: Array<any> = [];
        this._setCheckedId.forEach((id) => {
            idLs = [...idLs, id];
        })
        return idLs.join(",");
    }

    /**
     * 是否已选
     */
    has(id: any): boolean {
        return this._setCheckedId.has(id)
    }

    /**
     * 已选熟练
     */
    size(): any {
        return this._setCheckedId.size;
    }

    /**
     * 添加已选数据
     */
    addCheckedId(id: any): void {
        this._setCheckedId.add(id);
    }

}