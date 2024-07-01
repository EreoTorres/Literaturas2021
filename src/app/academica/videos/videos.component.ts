import { Component, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as EventEmitter from 'events';
import { LiteraturasService } from 'src/app/services/http-service/academica/literaturas/literaturas.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { DatePipe } from '@angular/common';
import { VideosService } from 'src/app/services/http-service/academica/videos/videos.service';
import { UntypedFormGroup } from '@angular/forms';
import { ValidTipoTextService } from 'src/app/services/validaciones/valid-tipo-text.service';
import { AcademicaComponent } from '../academica.component';
import { AppComponent } from 'src/app/app.component';
import { connect } from 'http2';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})

export class VideosComponent implements OnInit {

  @Output() setView  = new EventEmitter();
  @Output() getRegistros  = new EventEmitter();
  @Input() registros: any;
  @ViewChild('links') links: ElementRef;

  pagination: any;
  programas: any = [];
  generaciones: any = [];
  tipofiltro: any = '1';
  date: any;
  filtrotxt: any = '';
  titulo_videos: any = 'Agregar Video';
  planestudio_f: any = 0;
  materias: any;
  categorias: any;
  materias2: any;
  formulario: UntypedFormGroup;
  generaciones_required:any = ['50', '89'];
  tipo_categoria: any = [{
    id:0,
    tipo: 'seleccione un tipo',
    connection:0
  }];
  generacion_required:boolean = false;
  video: any = {
    servicio: 'video',
    titulo_video: '',
    url_video: '',
    html_iframe: '',
    descripcion: '',
    id_plan_estudio: undefined,
    id_generacion:undefined,
    tipo: undefined,
    id_materia: undefined,
    id_categoria: undefined,
    estatus:1,
    id:0,
    id_usuario: sessionStorage.getItem('id'),
    connection: 0
  }

  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'editar', title: '<i class="material-icons-outlined">edit</i>&nbsp;'},
        { name: 'eliminar', title: '&nbsp;<i class="material-icons-outlined">delete</i>' },
      ],
      position: 'right'
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
        width: '7%'
      },
      titulo_video: {
        title: 'Título',
        type: 'string',
        width: '25%'
      },
      nombre_plan_estudio: {
        title: 'Plan Estudio',
        type: 'string',
        width: '15%'
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
    public validText: ValidTipoTextService,
    private academica:AcademicaComponent,
    private literaturasHTTP:LiteraturasService,
    private app: AppComponent
  ) { 
  }

  ngOnInit(): void {
    this.MessagesService.showLoading();
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getProgramas();
    this.getCategorias();
    this.getVideos();
  }

  getProgramas() {
    this.videosHTTP.getProgramas().then(datas => {
      var res: any = datas;
      this.programas = res.resultado
    });
  }

  getCategorias() {
    this.videosHTTP.getCategorias().then(datas => {
      var res: any = datas;
      this.categorias = res.resultado
    });
  }

  getVideos() {    
    this.videosHTTP.getVideos().then(datas => {
      var res: any = datas;
      this.registros = res.resultado.dataDO.concat(res.resultado.dataAWS).sort((a, b) => {
        let fechaA: any = new Date(a.orden);
        let fechaB: any = new Date(b.orden);
        return fechaB - fechaA;
      });
      this.MessagesService.closeLoading();
    });
  }


  onCustom(ev) {
    if(ev.action == 'editar') this.openModal(ev.data);
    else if(ev.action == 'eliminar') {
      this.video.id = ev.data.id;
      this.video.estatus = 0;
      this.video.id_plan_estudio = ev.data.id_plan_estudio;
      this.video.connection = ev.data.connection;
      this.MessagesService.showConfirmDialog('¿Seguro que deseas eliminar el video?', '').then((result) => {
        if(result.isConfirmed) {
          this.MessagesService.showLoading();
          this.videosHTTP.updateVideos(this.video)
          .then(data => {
            this.MessagesService.closeLoading();
            if(data['codigo'] == 200) {
              this.MessagesService.showSuccessDialog(data['resultado'][0].message, 'success');
              this.getVideos();
            }
            else this.MessagesService.showSuccessDialog('Ocurrio un error al eliminar video.', 'error');
          });
        }
      });
    }
  }

  getVideoUno() {
    this.MessagesService.showLoading();
    let data = {
      id: this.video.id,
      connection: this.video.connection
    }
    this.videosHTTP.getVideoUno(data).then(datas => {
      var res: any = datas;
      res = res.resultado
      this.video = res[0];
      
      this.getPlanEstudioChange(1, this.video.id_plan_estudio);
      this.tipoCategoriaChange(1, this.video.tipo)
      this.MessagesService.closeLoading();
    });
  }

  getGeneraciones(id_plan_estudio) {
    this.generaciones = null;
    if(id_plan_estudio > 0 ){
      this.MessagesService.showLoading();
      this.videosHTTP.getGeneraciones({id:id_plan_estudio}).then(datas => {
        var res: any = datas;
        this.generaciones = res.resultado
        this.MessagesService.closeLoading();
      });
    }else{
      this.getVideos();
    }
    this.video.id_generacion = undefined;
  }

  openModal(video) {
    this.modalService.open(this.links, {
      backdrop: 'static',
      keyboard: false,  // to prevent closing with Esc button (if you want this too)
      size: 'xl'
    }); 
    this.resetForm(video);
    this.titulo_videos = "Agregar Video";
    if(video.id > 0) {
      this.titulo_videos = "Editar Video";
      this.getVideoUno();
    }
  }

  obtenerConnection(id_plan_estudio: any) {
    return this.programas.find((programa : any) => programa.id == id_plan_estudio).connection;
  }

  guardar(modal, links) {
    if(this.video.id_plan_estudio == 0) {
      this.MessagesService.showSuccessDialog("El plan de estudio es requerido.", 'error');
      return;
    }
    if([1,3].includes(this.video.tipo) && this.video.id_materia == 0) {
      this.MessagesService.showSuccessDialog("La materia es requerida.", 'error');
      return;
    }
    if(this.video.tipo == 2 && this.video.id_categoria == 0){
      this.MessagesService.showSuccessDialog("La categoria es requerida.", 'error');
      return;
    }

    if(this.generaciones_required.includes(this.video.id_plan_estudio) && (this.video.id_generacion == 0 || this.video.id_generacion == undefined)){
      this.MessagesService.showSuccessDialog("La generación es requerida.", 'error');
      return;
    }

    modal.close('Save click');
    this.MessagesService.showLoading();

    this.video.connection = this.tipo_categoria.find((t : any) => t.id == this.video.tipo).connection
    this.videosHTTP.updateVideos(this.video)
    .then (data => {
      var res: any = data
      res = res.resultado
      this.MessagesService.closeLoading();
      if(res[0][0].success) {
        this.MessagesService.showSuccessDialog(res[0][0].message, 'success')
        .then(() => {
          this.getVideos();
          this.modalService.dismissAll();
        });
      }
      else this.MessagesService.showSuccessDialog('Error al registrar.', 'error');
    })
    .catch(err => this.MessagesService.showSuccessDialog(err, 'error'))
  }

  getMaterias(modal, connection) {
    this.materias = null;
    this.materias2 = null;
    if(this.video.id_plan_estudio > 0 ){
      this.MessagesService.showLoading();

      let data = {
        id_plan_estudio: this.video.id_plan_estudio,
        connection: connection
      }

      this.literaturasHTTP.getMaterias(data).then(datas => {
        var res: any = datas;
        this.MessagesService.closeLoading();
  

        if(modal != 1){
          this.materias = res.resultado
          this.getVideos();
        }else{
          this.materias2 = res.resultado
        }
      });
    }else{
      this.getVideos();
    }
    if (this.video.id == 0) {
      this.video.id_materia = undefined;
    }
  }

  getPlanEstudioChange(modal, id_plan_estudio) {
    let connection = this.obtenerConnection(id_plan_estudio)
    if([0,1].includes(connection))
    {
      this.tipo_categoria = [{id:1, tipo: 'Por Materia', connection: connection},{id:2, tipo: 'Por Categoria', connection:connection}]
    } else {
      this.tipo_categoria = [{id:1, tipo: 'Por Materia - DO', connection: 0},{id:3, tipo: 'Por Materia - AWS', connection: 1}, {id:2, tipo: 'Por Categoria - DO', connection:0}, {id:4, tipo: 'Por Categoria - AWS', connection:1}]
    }
    
    if (this.video.id == 0) {
      this.video.tipo = undefined;
    }

   // this.getMaterias(modal, id_plan_estudio);
    if(this.generaciones_required.includes(id_plan_estudio)) {
      this.generacion_required = true;
      this.getGeneraciones(id_plan_estudio);
    }
    else this.generacion_required = false;
  }

  tipoCategoriaChange(modal, tipo){
    let connection = this.tipo_categoria.find((t : any) => t.id == tipo).connection
    this.getMaterias(modal, connection)
  }

  resetForm(video) {
    this.video= {
      servicio: 'video',
      titulo_video: '',
      url_video: '',
      html_iframe: '',
      descripcion: '',
      id_plan_estudio: undefined,
      tipo: 1,
      id_materia: undefined,
      id_categoria:undefined,
      id_generacion:undefined,
      estatus:1,
      id:video.id,
      id_usuario: sessionStorage.getItem('id'),
      connection: video.connection
    }

    this.tipo_categoria = [{
      id:0,
      tipo: 'seleccione un tipo',
      connection:0
    }];
  }
  
}
