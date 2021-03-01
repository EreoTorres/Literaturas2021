import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as EventEmitter from 'events';
import { LiteraturasService } from 'src/app/services/http-service/literaturas/literaturas.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { VideosService } from 'src/app/services/http-service/videos/videos.service';
import { FormBuilder, FormGroup, Validators, FormArray ,NgForm} from '@angular/forms';
import { ValidTipoTextService } from 'src/app/services/validaciones/valid-tipo-text.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  @Output() setView  = new EventEmitter();
  @Output() getRegistros  = new EventEmitter();
  @Input() registros: any;

  pagination: any;
  programas: any;
  tipofiltro: any = '1';
  date: any;
  filtrotxt: any = '';
  titulo_videos: any = 'Agregar Video';
  planestudio_f: any = 0;
  formulario: FormGroup;

  constructor(
    private literaturasHTTP: LiteraturasService,
    private videosHTTP: VideosService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    public validText: ValidTipoTextService
  ) { }

  ngOnInit(): void {
    this.getProgramasAcademicos();
    this.initForm();
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  initForm(){
    this.formulario = this.formBuilder.group({
      id_plan_estudio: [0,[Validators.required]],
      titulo_video: [null,[Validators.required]],
      descripcion: [null,[Validators.required]],
      url_video: [null,[Validators.required]],
      html_iframe: [null,[Validators.required]],
      servicio: ['vimeo',[Validators.required]],
    });
  }

  getProgramasAcademicos(){
    this.MessagesService.showLoading();
    this.literaturasHTTP.getProgramasAcademicos().then(datas => {
      var res: any = datas;
      this.MessagesService.closeLoading();

      this.programas = res.resultado
    });
  }

  getVideos(){
    var filtrado = {tipofiltro: this.tipofiltro, filtro: null};
    this.MessagesService.showLoading();

    if(this.tipofiltro == 1){
      filtrado.filtro = this.filtrotxt;
    }else if(this.tipofiltro == 2){
      filtrado.filtro = this.planestudio_f;
    }else{
      filtrado.filtro = this.date;
    }

    this.videosHTTP.getVideos(filtrado).then(datas => {
      var res: any = datas;
      this.MessagesService.closeLoading();

      this.registros = res.resultado
    });
  }

  openModal(docs){
    this.modalService.open(docs, {
      backdrop: 'static',
      keyboard: false,  // to prevent closing with Esc button (if you want this too)
      size: 'xl'
    }); 
  }

  guardar(value){
    if (this.formulario.valid && value.id_plan_estudio > 0) {
      this.MessagesService.showLoading();
      value.id_usuario = sessionStorage.getItem('id');

      this.videosHTTP.setVideos(value).then(datas => {
        var res: any = datas;
        this.MessagesService.closeLoading();
  
        if(res.codigo == 200){
          this.MessagesService.showSuccessDialog("El video fue guardado correctamente",'success').then(() => {
            this.getVideos();
            this.modalService.dismissAll();
          });
        }
      });
    }else{
      this.MessagesService.showSuccessDialog("No es posible continuar, todos los campos son obligatorios",'error');
    }
  }

  cerrarModal(){
  }
}
