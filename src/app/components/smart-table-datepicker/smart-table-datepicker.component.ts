import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'smart-table-datepicker',
  templateUrl: './smart-table-datepicker.component.html',
  styleUrls: ['./smart-table-datepicker.component.css']
})
export class SmartTableDatepickerComponent extends DefaultEditor implements OnInit {

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
    if(!this.cell.getValue()){
      this.inputModel = new Date();
    }else{
      this.inputModel = this.newUYDate(this.cell.getValue()+' 00:00:00');
    }

    this.cell.newValue = this.pipe.transform(this.inputModel.toISOString(), 'dd/MM/yyyy');
  }

  onChange() {
    if(this.inputModel) {
      this.cell.newValue = this.pipe.transform(this.inputModel.toISOString(), 'dd/MM/yyyy');
    }
  }

  
  newUYDate(pDate) {
    let dd = pDate.split("/")[0].padStart(2, "0");
    let mm: any = pDate.split("/");

    if(mm.length != 2){
      mm = pDate.split("/")[1].padStart(2, "0");
    }else{
      mm = pDate.split("/")[1];
    }

    let yyyy = pDate.split("/")[2].split(" ")[0];

    mm = (parseInt(mm) - 1).toString(); // January is 0
  
    return new Date(yyyy, mm, dd);
  }
}

@Component({
  template: `{{value | date: 'dd/MM/yyyy'}}`,
})
export class SmartTableDatepickerRenderComponent implements ViewCell, OnInit {
  @Input() value: string;
  @Input() rowData: any;

  constructor() { }

  ngOnInit() { }

}