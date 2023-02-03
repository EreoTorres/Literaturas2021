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
import { LiteraturasComponent } from '../academica/literaturas/literaturas.component';
import { VideosComponent } from '../academica/videos/videos.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';
import { AcademicaRoutingModule } from './academica-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { GacetaComponent } from '../academica/gaceta/gaceta.component';
import { BibliotecaVirtualComponent } from './biblioteca-virtual/biblioteca-virtual.component';
import { CertificacionesComponent } from './certificaciones/certificaciones.component';
import { ReporteEncuestaSatisfaccionComponent } from './reporte-encuesta-satisfaccion/reporte-encuesta-satisfaccion.component';
import { PromedioMateriasComponent } from './promedio-materias/promedio-materias.component';

import {TableModule} from 'primeng/table'; 
import {TabViewModule} from 'primeng/tabview';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {ChartModule} from 'primeng/chart'

@NgModule({
  declarations: [
    LiteraturasComponent,
    VideosComponent,
    GacetaComponent,
    BibliotecaVirtualComponent,
    CertificacionesComponent,
    ReporteEncuestaSatisfaccionComponent,
    PromedioMateriasComponent,
  ],
  imports: [
    AcademicaRoutingModule,
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
    TableModule,
    TabViewModule,
    MatSelectModule,
    ChartModule
  ],
})
export class AcademicaModule {
}
