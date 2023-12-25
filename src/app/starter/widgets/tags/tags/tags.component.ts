import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  colors: any = {
    '本司': "geekblue",
    '非本司': "cyan",
    '专利':'purple',
    '软著':'purple',
    '实用新型专利':'cyan',
    '发明专利':'volcano',
    '外观设计专利':'volcano',
    '虚': "geekblue",
    '实': "cyan",
    '补':'purple',
    '推广': "cyan",
    '工资':'purple',
    '报销':'geekblue'
  };

  @Input() status: string = "";

  constructor() {
  }

  ngOnInit(): void {
  }

}
