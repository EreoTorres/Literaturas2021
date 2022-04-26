import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GacetaService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getLibros() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/gaceta/getLibros',{anio: 0}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  updateLibro(libro) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/gaceta/updateLibro', libro, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  uploadFile(formdata) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'generico/files/setFiles', formdata)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
}
