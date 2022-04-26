import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControlEscolarService {
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
    if(sessionStorage.getItem('departamento') == '3' || sessionStorage.getItem('departamento') == '6' ||
       sessionStorage.getItem('departamento') == '4'){
      return true;
    }else{
      this.router.navigate(['login']);
      return false;
    }
  }
}
