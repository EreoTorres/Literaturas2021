import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as EventEmitter from 'events';
import { LiteraturasService } from 'src/app/services/http-service/academica/literaturas/literaturas.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { VideosService } from 'src/app/services/http-service/academica/videos/videos.service';
import { FormBuilder, FormGroup, Validators, FormArray ,NgForm} from '@angular/forms';
import { ValidTipoTextService } from 'src/app/services/validaciones/valid-tipo-text.service';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';

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
  programas: any = [];
  tipofiltro: any = '1';
  date: any;
  filtrotxt: any = '';
  titulo_videos: any = 'Agregar Video';
  planestudio_f: any = 0;
  formulario: FormGroup;

  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: false,
      edit: false,
      delete: false
    },
    edit: {
      editButtonContent: '<i class="material-icons-outlined">edit</i>',
      saveButtonContent: '<i class="material-icons-outlined">save</i>',
      cancelButtonContent: '<i class="material-icons-outlined">close</i>',
    },
    delete: {
      deleteButtonContent: '<i class="material-icons-outlined">delete</i>',
    },
    attr: {
      class: 'table table-bordered responsive'
    },
    pager: {
      perPage: 10,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        width: '10%'
      },
      titulo_video: {
        title: 'Título',
        type: 'string',
        width: '25%'
      },
      nombre_plan_estudio: {
        title: 'Plan Estudio',
        type: 'string',
        width: '25%'
      },
      descripcion: {
        title: 'Descripción',
        type: 'string',
        width: '25%'
      },
      fecha_modificacion: {
        title: 'Fecha de modificación',
        type: 'string',
        width: '15%',
        filter: true
      }
    }
  };

  constructor(
    private videosHTTP: VideosService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    public validText: ValidTipoTextService
  ) { 
    this.getProgramasAcademicos();
  }

  ngOnInit(): void {
    this.initForm();
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getVideos();
  }

  onCustomAction(event){
    alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`);
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
    for(let datos of JSON.parse(localStorage.getItem('programas'))){
      this.programas.push({id: datos.id, nombre_corto: datos.nombre_corto})
    }
  }

  getVideos(){
    this.MessagesService.showLoading();
    this.videosHTTP.getVideos().then(datas => {
      var res: any = datas;
      this.registros = res.resultado
      this.MessagesService.closeLoading();
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

        this.resetForm();
      });
    }else{
      this.MessagesService.showSuccessDialog("No es posible continuar, todos los campos son obligatorios",'error');
    }
  }

  resetForm(){
    this.formulario.reset()
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key).setErrors(null);
    });

    this.formulario.get('servicio').setValue('vimeo');
    this.formulario.get('id_plan_estudio').setValue(0);
  }
}
