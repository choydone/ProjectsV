import {Component, forwardRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  @Input() status: number = -1;
  @Input() statusText: string = '未找到';
  @Input() colorKey: string = 'default';
  constructor() {
  }

  ngOnInit(): void {
  }

}
