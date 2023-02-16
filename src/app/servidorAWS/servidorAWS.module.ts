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
import { MatDialogModule } from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';
import { RutasCursamientoComponent } from './rutas-cursamiento/rutas-cursamiento.component';
import { ServidorAWSComponent } from './servidorAWS.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ServidorAWSRoutingModule } from './servidorAWS-routing.module';
//import { EncuestasComponent } from './encuestas/encuestas.component';
//import { ExpedienteDigitalComponent } from './expediente-digital/expediente-digital.component';
//import { EventosComponent } from './eventos/eventos.component';
//import { FormularioEventosComponent } from './eventos/formulario-eventos/formulario-eventos.component';
//import { AgendaComponent } from './eventos/agenda/agenda.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    ServidorAWSComponent,
    RutasCursamientoComponent,
  ],
  imports: [
    ServidorAWSRoutingModule,
    FormsModule,
    DragDropModule,
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
    CommonModule,
    CKEditorModule,
  ],
})
export class ServidorAWSModule {
}
