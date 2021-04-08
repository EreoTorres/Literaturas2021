import {ChangeDetectorRef, Component, OnDestroy,OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

import { MENU_ITEMS } from './academica-menu';
import { MENU_ITEMS_ADMIN } from '../components/administrador-menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-academica',
  templateUrl: './academica.component.html',
  styleUrls: ['./academica.component.css']
})
export class AcademicaComponent implements OnInit {
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  menus: any = MENU_ITEMS;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,public router: Router) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('departamento') == '4'){
      this.menus = MENU_ITEMS_ADMIN;
    }
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
