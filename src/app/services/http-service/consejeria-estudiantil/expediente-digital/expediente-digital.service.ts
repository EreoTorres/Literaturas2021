import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteDigitalService {
  public url = environment.urlProduccion;
  httpHeaders: any;
  ruta: string = 'consejeria_estudiantil/expediente_digital/'

  constructor(public http:HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  generico(metodo: string, data: any = {}) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + this.ruta + metodo, data, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    })
  }
}
