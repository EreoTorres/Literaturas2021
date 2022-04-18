import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';


@Component({
  selector: 'app-estatus-select',
  templateUrl: './estatus-select.component.html',
  styleUrls: ['./estatus-select.component.css']
})
export class EstatusSelectComponent extends DefaultEditor implements OnInit {
  ngOnInit() {
    if(!this.cell.getValue()){
      this.cell.newValue = 'Activo';
    }else{
      this.cell.newValue = this.cell.getValue();
    }
  }
}
