import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { GlobalConstants } from './global-constants';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-academica',
  templateUrl: './academica.component.html',
  styleUrls: ['./academica.component.css']
})

export class AcademicaComponent implements OnInit {
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  menus: any = [];
  programas: any = [];
  showMenu: boolean = true;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public router: Router,
    public app: AppComponent
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.showMenu = GlobalConstants.showMenu;

    this.menus = this.app.getMenu()
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
      this.programas.push(
        {
          id: datos.id,
          nombre_corto: datos.nombre_corto,
          connection: datos.connection
        }
      )
    }
    
    return this.programas;
  }
}