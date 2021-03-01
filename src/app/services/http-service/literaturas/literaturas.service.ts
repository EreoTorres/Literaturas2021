import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiteraturasService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) { 
    this.httpHeaders = {
      headers: new HttpHeaders({        
        'Content-Type': 'application/json'
      })
    };
  }

  getListados(filtrado){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'literaturas/getLiteraturas',filtrado,this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getProgramasAcademicos(){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'literaturas/getProgramasAcademicos',this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getMaterias(id_planestudio){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'literaturas/getMaterias',{id: id_planestudio},this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  setLiteraturas(formdata){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'literaturas/setLiteraturas',formdata)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
}
