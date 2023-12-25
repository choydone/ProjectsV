import {Component,  Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tooltip-question',
  templateUrl: './tooltip-question.component.html',
  styleUrls: ['./tooltip-question.component.scss']
})
export class TooltipQuestionComponent implements OnInit {

  @Input() text: string = '未找到';

  constructor() {
  }

  ngOnInit(): void {
  }

}
