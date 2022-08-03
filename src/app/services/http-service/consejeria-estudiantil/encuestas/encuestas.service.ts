import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {
  public url = environment.urlProduccion;
  httpHeaders: any;
  ruta: string = 'consejeria_estudiantil/encuestas/'

  constructor(public http:HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getEncuestas(info) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + this.ruta + 'getEncuestas', info, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    })
  }

  getAlumno(alumno) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + this.ruta + 'getAlumno', alumno, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    })
  }

  asignarEncuestaAlumno(alumno) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + this.ruta + 'asignarEncuestaAlumno', alumno, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    })
  }
}
