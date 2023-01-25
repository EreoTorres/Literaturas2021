import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-cereporte',
  templateUrl: './cereporte.component.html',
  styleUrls: ['./cereporte.component.css']
})
export class CereporteComponent implements OnInit {
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  menus: any = [];

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
    this.menus = this.app.getMenu()
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


}
