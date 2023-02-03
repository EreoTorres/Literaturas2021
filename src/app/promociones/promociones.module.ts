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
import { PromocionesRoutingModule } from './promociones-routing.module';
import { ProgramacionesComponent } from './programaciones/programaciones.component';
import { PublicidadComponent } from './publicidad/publicidad.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormularioSesionesVirtualesComponent } from './programaciones/formulario-sesiones-virtuales/formulario-sesiones-virtuales.component';
import { HorariosSesionesVirtualesComponent } from './programaciones/horarios-sesiones-virtuales/horarios-sesiones-virtuales.component';
import { AsistentesComponent } from './campanias-asistentes/campanias-asistentes.component';

@NgModule({
  declarations: [
    ProgramacionesComponent,
    PublicidadComponent,
    FormularioSesionesVirtualesComponent,
    HorariosSesionesVirtualesComponent,
    AsistentesComponent,
  ],
  imports: [
    PromocionesRoutingModule,
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
export class PromocionesModule {
}
