import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getMotivos() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'consejeria_estudiantil/citas/getMotivos', {}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getHorarios() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'consejeria_estudiantil/citas/getHorarios', {}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getEstatus(tipo) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'consejeria_estudiantil/citas/getEstatus', tipo, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getConsejeros() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'consejeria_estudiantil/citas/getConsejeros', {}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getAlumno(alumno) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'consejeria_estudiantil/citas/getAlumno', alumno, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getAlumnoTelefonos(alumno) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'consejeria_estudiantil/citas/getAlumnoTelefonos', alumno, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getCitas() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'consejeria_estudiantil/citas/getCitas', {}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  actualizarCita(cita) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'consejeria_estudiantil/citas/actualizarCita', cita, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
}
