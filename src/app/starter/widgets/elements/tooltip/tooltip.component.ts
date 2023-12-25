import {Component,  Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  @Input() text: string = '未找到';

  @Input() tooltipColor: string = 'volcano';

  @Input() iconColor: string = 'gray';

  @Input() iconType: string = 'info-circle';
  constructor() {
  }

  ngOnInit(): void {
  }

}
