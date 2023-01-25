import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CereporteService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient, public router: Router) { 
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(sessionStorage.getItem('departamento')) {
      return true;
    }
    else {
      this.router.navigate(['login']);
      return false;
    }
  }

  getPlanes() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'cereporte/cereporte/getPlanes', {}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  getColumnas(value :any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'cereporte/cereporte/getColumnas', value, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
  
  getRegistros(value :any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'cereporte/cereporte/getRegistros', value, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
}
