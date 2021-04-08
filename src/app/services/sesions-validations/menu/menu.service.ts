import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor( public router: Router) { }

  canActivate(): boolean {

      if (sessionStorage.getItem('id') == null) {
          this.router.navigate(['login']);
          return false;
      }
      return true;
  }
}
