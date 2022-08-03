import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from '../consejeria-estudiantil/consejeria-estudiantil-menu';
import { MENU_ITEMS_ADMIN } from '../components/administrador-menu';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consejeria-estudiantil',
  templateUrl: './consejeria-estudiantil.component.html',
  styleUrls: ['./consejeria-estudiantil.component.css']
})
export class ConsejeriaEstudiantilComponent implements OnInit {
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  menus: any = MENU_ITEMS;
  programas: any = [];

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

  getProgramasAcademicos(){
    for(let datos of JSON.parse(localStorage.getItem('programas'))){
      this.programas.push({id: datos.id, nombre_corto: datos.nombre_corto})
    }
    return this.programas;
  }

}
