import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/academica/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AcademicaSesionService {

  constructor( public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
      let pathname = document.location.pathname;

      if(pathname.split('/', 3)[2] == 'visualizador') {
        GlobalConstants.showMenu = false;
        return true;
      }
      else if(
        sessionStorage.getItem('departamento') == '4' || 
        sessionStorage.getItem('departamento') == '2' ||
        sessionStorage.getItem('departamento') == '16'
      ) {
        return true;
      }
      else {
        this.router.navigate(['login']);
        return false;
      }
  }
}
