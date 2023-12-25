export class Echeckbox {

  allChecked = false;
  indeterminate = true;
  checkOptionsOne: any[] = [
    {label: 'Apple', value: 'Apple', checked: true},
    {label: 'Pear', value: 'Pear', checked: false},
    {label: 'Orange', value: 'Orange', checked: false}
  ];

  initData(permissions: any[]): void {
    this.checkOptionsOne = [];
    if (!permissions) {
      return;
    }
    permissions.forEach((permission) => {
        this.checkOptionsOne = [...this.checkOptionsOne, {
          label: permission.name,
          value: permission.id,
          checked: permission.checked ? permission.checked : false
        }]
      }
    )

    this.updateSingleChecked()
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
}
