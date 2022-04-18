import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-inputprogramas',
  templateUrl: './inputprogramas.component.html',
  styleUrls: ['./inputprogramas.component.css']
})
export class InputprogramasComponent extends DefaultEditor implements OnInit {
  programas: any = [];

  ngOnInit() {
    this.programas = JSON.parse(localStorage.getItem('programas-formularios'))

    if(!this.cell.getValue()){
      this.cell.newValue = 'MDN COPPEL';
    }else{
      this.cell.newValue = this.cell.getValue();
    }
  }
}
