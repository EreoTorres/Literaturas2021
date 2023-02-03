import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
   }

   getPlanes(registro: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/encuesta/getPlanes',{}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
  
  getMaterias(registro: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/encuesta/getMaterias', registro, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getPromedioMaterias(registro: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/encuesta/getPromedioMaterias', registro, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getEncuestasMateriasActivas(registro: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/encuesta/getEncuestasMateriasActivas', registro, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getEncuestasMateriasInactivas(registro: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/encuesta/getEncuestasMateriasInactivas', registro, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getEncuestasPeriodos(registro: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/encuesta/getEncuestasPeriodos', registro, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getRespuestasEncuestas(registro: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/encuesta/getRespuestasEncuestas', registro, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getTotalEncuestasRealizadas(registro: object) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/encuesta/getTotalEncuestasRealizadas', registro, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

}
