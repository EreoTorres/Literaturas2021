import {ChangeDetectorRef, Component, OnDestroy,OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MessagesService } from '../services/messages/messages.service';
import { LiteraturasService } from '../services/http-service/literaturas/literaturas.service';
import { Router } from '@angular/router';
import { VideosService } from '../services/http-service/videos/videos.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  ventana: any = 'literaturas';
  registros: any;
  ambiente: any = 'Pruebas';
  prospecto: any;
  idusuario: any;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private literaturasHTTP: LiteraturasService,
    private MessagesService: MessagesService,
    private videosHTTP: VideosService,
    public router: Router
  ) {
    this.idusuario = sessionStorage.getItem('id');
    console.log(this.idusuario)
    if(sessionStorage.getItem('ambiente') == '0'){
      this.ambiente = 'Producción';
    }

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if(this.ventana == 'literaturas'){
      this.getRegistros(null)
    }else{
      this.getVideos(null)
    }
  }

  getRegistros(ev:any){
    var filtrado = {tipofiltro: 0, filtro: ''};

    this.MessagesService.showLoading();
    this.literaturasHTTP.getListados(filtrado).then(datas => {
      var res: any = datas;
      this.MessagesService.closeLoading();

      this.registros = res.resultado
    });
  }

  getVideos(ev:any){
    var filtrado = {tipofiltro: 0, filtro: 0};

    this.MessagesService.showLoading();
    this.videosHTTP.getVideos(filtrado).then(datas => {
      var res: any = datas;
      this.MessagesService.closeLoading();

      this.registros = res.resultado
    });
  }

  setVentana(event){
    if(event.vista == 'detalle' && event.datos){
      this.ventana = event.vista;
      this.prospecto = event.datos;
    }else{
      this.ventana = event.vista;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
