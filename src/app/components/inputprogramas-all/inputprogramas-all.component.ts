import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-inputprogramas-all',
  templateUrl: './inputprogramas-all.component.html',
  styleUrls: ['./inputprogramas-all.component.css']
})
export class InputprogramasAllComponent extends DefaultEditor implements OnInit {

  programas: any = [];

  ngOnInit() {
    this.programas = JSON.parse(localStorage.getItem('programas'))

    if(!this.cell.getValue()){
      this.cell.newValue = 'MDN COPPEL';
    }else{
      this.cell.newValue = this.searchname(this.cell.getValue())[0].id;
    }
  }

  searchname(name) {
    return this.programas.filter(
      function (data) {
        if (data.nombre_corto == name) {
          return data.id
        }
      }
    );
  }

}
