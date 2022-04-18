import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicidadService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http: HttpClient) { 
    this.httpHeaders = {
      headers: new HttpHeaders({        
        'Content-Type': 'application/json'
      })
    };
  }

  getHistorialBannerCertificaciones(){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'promocion/publicidadbanner/getHistorialBannerCertificaciones',{},this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  setPublicidad(datos){
    console.log(datos.base)
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'promocion/publicidadbanner/setPublicidad',datos,this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
}
