import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistentesService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getRegiones() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'campanias_promocion/asistentes/getRegiones', {}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
  
  getPlanes(datos) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'campanias_promocion/asistentes/getPlanes', datos, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getCampaniasFiltrado(datos) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'campanias_promocion/asistentes/getCampaniasFiltrado', datos, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getResponsables(datos) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'campanias_promocion/asistentes/getResponsables', datos, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getRegistros() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'campanias_promocion/asistentes/getRegistros', {}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }


  guardaRegistro(datos) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'campanias_promocion/asistentes/guardaRegistro', datos, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getUnRegistro(video){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'campanias_promocion/asistentes/getUnRegistro', video,this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }

}
