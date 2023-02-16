import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatToolbarModule } from  '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AcademicaSesionService } from './services/sesions-validations/sesion/academica/academica-sesion.service';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from './components/smart-table-datepicker/smart-table-datepicker.component';
import { OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SmartTableDatepickerComponentTime, SmartTableDatepickerRenderComponentTime } from './components/smart-table-datepicker-time/smart-table-datepicker-time.component';
import { NumberComponentDynamicComponent } from './components/number-component-dynamic/number-component-dynamic.component';
import { InputprogramasComponent } from './components/inputprogramas/inputprogramas.component';
import { EstatusSelectComponent } from './components/estatus-select-component/estatus-select.component';
import { AcademicaComponent } from './academica/academica.component';
import { PromocionesComponent } from './promociones/promociones.component';
import { PromocionesSesionService } from './services/sesions-validations/sesion/promociones/promociones-sesion.service';
import { InputImagenComponent } from './components/input-imagen/input-imagen.component';
import { OpcionesLiteraturasComponent } from './components/opciones-literaturas/opciones-literaturas.component';
import { SmatTablePickerDatetimeComponent } from './components/smat-table-picker-datetime/smat-table-picker-datetime.component';
import { ControlEscolarComponent } from './control-escolar/control-escolar.component';
import { ControlEscolarService } from './services/http-service/control-escolar/control-escolar.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { InputprogramasAllComponent } from './components/inputprogramas-all/inputprogramas-all.component';
import { ConsejeriaEstudiantilComponent } from './consejeria-estudiantil/consejeria-estudiantil.component';
import { ConsejeriaEstudiantilService } from './services/http-service/consejeria-estudiantil/consejeria-estudiantil.service';
//import { ServidorAWSComponent } from './servidorAWS/servidorAWS.component';
import { ServidorAWSService } from './services/http-service/servidorAWS/servidor-AWS.service';
import { VisualizadorComponent } from './visualizador/visualizador/visualizador.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { InputprogramasCeComponent } from './components/inputprogramas-ce/inputprogramas-ce.component';


export class DefaultIntl extends OwlDateTimeIntl {
  /** A label for the cancel button */
  cancelBtnLabel= 'Cancelar';

  /** A label for the set button */
  setBtnLabel= 'Aceptar';
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PromocionesComponent,
    AcademicaComponent,
    SmartTableDatepickerComponent,
    SmartTableDatepickerRenderComponent,
    SmartTableDatepickerComponentTime,
    SmartTableDatepickerRenderComponentTime,
    NumberComponentDynamicComponent,
    InputprogramasComponent,
    EstatusSelectComponent,
    InputImagenComponent,
    OpcionesLiteraturasComponent,
    SmatTablePickerDatetimeComponent,
    ControlEscolarComponent,
    InputprogramasAllComponent,
    ConsejeriaEstudiantilComponent,
    VisualizadorComponent,
    InputprogramasCeComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    MatGridListModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgbModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    Ng2SmartTableModule,
    CKEditorModule,
  ],
  entryComponents: [
    SmartTableDatepickerComponent,
    SmartTableDatepickerRenderComponent,
    SmartTableDatepickerComponentTime,
    SmartTableDatepickerRenderComponentTime,
    NumberComponentDynamicComponent,
    InputprogramasComponent,
    EstatusSelectComponent
  ],
  providers: [
    AcademicaSesionService,
    PromocionesSesionService,
    ControlEscolarService,
    ConsejeriaEstudiantilService,
    ServidorAWSService,
    DatePipe,
    { provide: OwlDateTimeIntl, useClass: DefaultIntl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
