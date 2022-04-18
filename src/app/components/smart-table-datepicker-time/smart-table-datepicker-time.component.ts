import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'smart-table-datepicker-time',
  templateUrl: './smart-table-datepicker-time.component.html',
  styleUrls: ['./smart-table-datepicker-time.component.css']
})
export class SmartTableDatepickerComponentTime extends DefaultEditor implements OnInit {

  @Input() placeholder: string = 'Choose a Date/Time';

  @Input() min: Date; // Defaults to now(rounded down to the nearest 15 minute mark)

  @Input() max: Date; // Defaults to 1 month after the min

  stringValue;
  inputModel: Date;
  pipe = new DatePipe('en-US'); // Use your own locale

  constructor() {
    super();
  }

  ngOnInit() {
    this.inputModel = new Date('03-03-2021 '+this.cell.getValue());
    this.cell.newValue = this.inputModel.toLocaleTimeString([],{hour: '2-digit', minute: '2-digit'});
  }

  onChange() {
    if(this.inputModel) {
      this.cell.newValue = this.inputModel.toLocaleTimeString([],{hour: '2-digit', minute: '2-digit'});
    }
  }

}

@Component({
  template: `{{value}}`,
})
export class SmartTableDatepickerRenderComponentTime implements ViewCell, OnInit {
  @Input() value: string;
  @Input() rowData: any;

  constructor() { }

  ngOnInit() { }

}