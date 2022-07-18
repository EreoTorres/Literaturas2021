import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';
import { CitasComponent } from './citas/citas.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConsejeriaEstudiantilRoutingModule } from './consejeria-estudiantil-routing.module';
import { EncuestasComponent } from './encuestas/encuestas.component';

@NgModule({
  declarations: [
    CitasComponent,
    EncuestasComponent,
  ],
  imports: [
    ConsejeriaEstudiantilRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    NgxDropzoneModule,
    NgxPaginationModule,
    CommonModule
  ],
})
export class ConsejeriaEstudiantilModule {
}
