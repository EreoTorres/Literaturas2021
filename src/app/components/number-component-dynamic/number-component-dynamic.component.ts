import { Component, OnInit } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-number-component-dynamic',
  templateUrl: './number-component-dynamic.component.html',
  styleUrls: ['./number-component-dynamic.component.css']
})

export class NumberComponentDynamicComponent extends DefaultEditor implements OnInit {
  programas: any;

  ngOnInit() {
    if(this.cell.getValue() && this.cell.getValue() != 0){
      this.cell.newValue = this.cell.getValue();
    }else{
      this.cell.newValue = 0;
    }
  }
}