import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AcademicaSesionService {

  constructor( public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
      if(sessionStorage.getItem('departamento') == '4' || sessionStorage.getItem('departamento') == '2'){
        return true;
      }else{
        this.router.navigate(['login']);
        return false;
      }
  }
}
