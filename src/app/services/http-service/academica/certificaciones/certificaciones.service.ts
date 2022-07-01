import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificacionesService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getCertificaciones() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'academica/certificaciones/getCertificaciones', {}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getListaCertificaciones() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'academica/certificaciones/getListaCertificaciones', {}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  actualizarCertificacion(certificacion) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'academica/certificaciones/actualizarCertificacion', certificacion, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
}
