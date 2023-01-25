import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CereporteRoutingModule } from './cereporte-routing.module';
import { ReporteComponent } from './reporte/reporte.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MultiSelectModule } from 'primeng/multiselect';
import {PanelModule} from 'primeng/panel';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {TableModule} from 'primeng/table';

@NgModule({
  declarations: [ReporteComponent],
  imports: [
    CommonModule,
    CereporteRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MultiSelectModule,
    PanelModule,
    Ng2SearchPipeModule,
    TableModule

  ]
})
export class CereporteModule { }
