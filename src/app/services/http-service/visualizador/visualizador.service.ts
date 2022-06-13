import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisualizadorService {public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getLectura(lectura) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'academica/biblioteca_virtual/getLectura', lectura, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
}
