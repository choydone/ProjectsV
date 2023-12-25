import {Component,Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  badges: any = {
    '10': 'orange',
    '11': 'red',
    '20': "cyan",
    '21': 'orange',
    '30': "gold",
    '40': 'volcano',
    '60': "lime",
    '70': 'green',
    '80': "cyan",
    '90': 'blue',
    '100': "geekblue",
    '110': 'purple'
  }

  @Input() status: number = -1;
  @Input() statusText: string = '未找到';

  constructor() {
  }

  ngOnInit(): void {
  }

}
