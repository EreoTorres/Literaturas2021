import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelacionMateriasService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient, public router: Router) { 
    this.httpHeaders = {
      headers: new HttpHeaders({        
        'Content-Type': 'application/json'
      })
    };
  }

  getRelacion(relacion){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'control_escolar/relacion_materia/getRelacion',relacion, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }

  setRelaciones(relacion){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'control_escolar/relacion_materia/setRelaciones',relacion, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }

  getAutoridad(){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'control_escolar/relacion_materia/getAutoridad',{}, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }

  getMaterias(plan_estudio){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'control_escolar/relacion_materia/getMaterias',plan_estudio, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }

  getRutas(data){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'control_escolar/relacion_materia/getRutas', data,this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

}
