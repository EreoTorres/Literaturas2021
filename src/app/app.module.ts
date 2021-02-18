import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatToolbarModule } from  '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SesionService } from './services/sesion/sesion.service';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LiteraturasComponent } from './panel/literaturas/literaturas/literaturas.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PanelComponent,
    LiteraturasComponent
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
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [    
    SesionService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
