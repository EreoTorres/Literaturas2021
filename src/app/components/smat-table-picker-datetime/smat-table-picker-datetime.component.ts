import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-smat-table-picker-datetime',
  templateUrl: './smat-table-picker-datetime.component.html',
  styleUrls: ['./smat-table-picker-datetime.component.css']
})
export class SmatTablePickerDatetimeComponent extends DefaultEditor implements OnInit {

  @Input() placeholder: string = 'Choose a Date/Time';

  @Input() min: Date; // Defaults to now(rounded down to the nearest 15 minute mark)

  @Input() max: Date; // Defaults to 1 month after the min

  stringValue;
  inputModel: any;
  pipe = new DatePipe('en-US'); // Use your own locale

  constructor() {
    super();
  }

  ngOnInit() {
    if(!this.cell.getValue()){
      this.inputModel = new Date();
    }else{
      this.inputModel = this.newUYDate(this.cell.getValue());
    }

    this.cell.newValue = this.pipe.transform(this.inputModel.toISOString(), 'dd/MM/yyyy HH:mm'); 
  }

  onChange() {
    if(this.inputModel) {
      this.cell.newValue = this.pipe.transform(this.inputModel.toISOString(), 'dd/MM/yyyy HH:mm');
    }
  }

  newUYDate(pDate) {
    let dd = pDate.split("/")[0].padStart(2, "0");
    let mm = pDate.split("/")[1].padStart(2, "0");
    let yyyy = pDate.split("/")[2].split(" ")[0];

    mm = (parseInt(mm) - 1).toString(); // January is 0
  
    if(mm.length == 1){
      mm ='0'+mm;
    }

    if(pDate.split(" ")[1]){
      let horas: any = pDate.split(" ")[1]+':00';
      horas = horas.split(":");
      return new Date(yyyy,mm,dd,parseInt(horas[0]),parseInt(horas[1]),parseInt(horas[2]));
    }else{
      return yyyy+'-'+mm+'-'+dd;
    }
  }
} 

