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
import { LiteraturasComponent } from '../academica/literaturas/literaturas.component';
import { VideosComponent } from '../academica/videos/videos.component';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';
import { AcademicaRoutingModule } from './academica-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { GacetaComponent } from '../academica/gaceta/gaceta.component';

@NgModule({
  declarations: [
    LiteraturasComponent,
    VideosComponent,
    GacetaComponent,
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
    CommonModule
  ],
})
export class AcademicaModule {
}
