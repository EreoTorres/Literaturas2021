import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';
import { CitasComponent } from './citas/citas.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConsejeriaEstudiantilRoutingModule } from './consejeria-estudiantil-routing.module';
import { EncuestasComponent } from './encuestas/encuestas.component';
import { ExpedienteDigitalComponent } from './expediente-digital/expediente-digital.component';
import { EventosComponent } from './eventos/eventos.component';
import { FormularioEventosComponent } from './eventos/formulario-eventos/formulario-eventos.component';
import { AgendaComponent } from './eventos/agenda/agenda.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    CitasComponent,
    EncuestasComponent,
    ExpedienteDigitalComponent,
    EventosComponent,
    FormularioEventosComponent,
    AgendaComponent
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
    CommonModule,
    CKEditorModule
  ],
})
export class ConsejeriaEstudiantilModule {
}
