import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormulariosSesionesvirtualesService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) { 
    this.httpHeaders = {
      headers: new HttpHeaders({        
        'Content-Type': 'application/json'
      })
    };
  }

  getFormularios(){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'promocion/formulario_sesionesvirtuales/getFormularios',{}, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }

  setFormulario(programacion){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'promocion/formulario_sesionesvirtuales/setFormulario', programacion, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }
}
