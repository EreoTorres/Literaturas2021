import { Component, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as EventEmitter from 'events';
import { LiteraturasService } from 'src/app/services/http-service/academica/literaturas/literaturas.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { VideosService } from 'src/app/services/http-service/academica/videos/videos.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray ,NgForm} from '@angular/forms';
import { ValidTipoTextService } from 'src/app/services/validaciones/valid-tipo-text.service';
import { AcademicaComponent } from '../academica.component';
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
  video: any = {
    servicio: 'video',
    titulo_video: '',
    url_video: '',
    html_iframe: '',
    descripcion: '',
    id_plan_estudio: undefined,
    id_generacion:undefined,
    tipo: 1,
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
    private formBuilder: UntypedFormBuilder,
    public validText: ValidTipoTextService,
    private academica:AcademicaComponent,
    private literaturasHTTP:LiteraturasService
  ) { 
  }

  ngOnInit(): void {
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getVideos();
    this.programas = this.academica.getProgramasAcademicos();
    this.getCategorias();
  }

  getVideos() {
    this.MessagesService.showLoading();
    this.videosHTTP.getVideos().then(datas => {
      var res: any = datas;
      this.registros = res.resultado.dataDO.concat(res.resultado.dataAWS).sort((a, b) => {
        let fechaA: any = new Date(a.fecha_modificacion);
        let fechaB: any = new Date(b.fecha_modificacion);
        return fechaB - fechaA;
      });
      this.MessagesService.closeLoading();
    });
  }

  getCategorias() {
    this.MessagesService.showLoading();
    this.videosHTTP.getCategorias().then(datas => {
      var res: any = datas;
      this.categorias = res.resultado
      this.MessagesService.closeLoading();
    });
  }

  onCustom(ev) {
    if(ev.action == 'editar') this.openModal(ev.data.id, ev.data.id_plan_estudio);
    else if(ev.action == 'eliminar') {
      this.video.id = ev.data.id;
      this.video.estatus = 0;
      this.MessagesService.showConfirmDialog('¿Seguro que deseas eliminar el video?', '').then((result) => {
        if(result.isConfirmed) {
          this.MessagesService.showLoading();
          this.videosHTTP.updateVideos(this.video)
          .then(data => {
            this.MessagesService.closeLoading();
            if(data['codigo'] == 200) {
              this.MessagesService.showSuccessDialog(data['resultado'][0].message, 'success').then((result) => {
                if(result.isConfirmed) this.getVideos();
              })
            }
            else this.MessagesService.showSuccessDialog('Ocurrio un error al eliminar video.', 'error');
          });
        }
      });
    }
  }

  getVideoUno(video, id_plan_estudio) {
    this.MessagesService.showLoading();
    let data = {
      id: this.video.id,
      connection: this.obtenerConnection(id_plan_estudio)
    }
    this.videosHTTP.getVideoUno(data).then(datas => {
      var res: any = datas;
      this.getPlanEstudioChange(1, res.resultado[0].id_plan_estudio);
      this.video = res.resultado[0];
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

  openModal(id_video, id_plan_estudio = 0) {
    this.modalService.open(this.links, {
      backdrop: 'static',
      keyboard: false,  // to prevent closing with Esc button (if you want this too)
      size: 'xl'
    }); 
    this.resetForm(id_video);
    this.titulo_videos = "Agregar Video";
    if(id_video > 0) {
      this.titulo_videos = "Editar Video";
      this.getVideoUno(this.video, id_plan_estudio);
    }
  }

  guardar(modal, links) {
    if(this.video.id_plan_estudio ==0) {
      this.MessagesService.showSuccessDialog("El plan de estudio es requerido.", 'error');
      return;
    }
    if(this.video.tipo == 1 && this.video.id_materia==0) {
      this.MessagesService.showSuccessDialog("La materia es requerida.", 'error');
      return;
    }
    if(this.video.tipo == 2 && this.video.id_categoria==0){
      this.MessagesService.showSuccessDialog("La categoria es requerida.", 'error');
      return;
    }

    if(this.video.id_plan_estudio == 50 && (this.video.id_generacion==0 || this.video.id_generacion==undefined)){
      this.MessagesService.showSuccessDialog("La generación es requerida.", 'error');
      return;
    }

    modal.close('Save click');
    this.MessagesService.showLoading();

    this.video.connection = this.obtenerConnection(this.video.id_plan_estudio);
    
    this.videosHTTP.updateVideos(this.video)
    .then(data => {
      return data['resultado'][0];
    })
    .then (data => {
      this.MessagesService.closeLoading();
      if(data.success) {
        this.MessagesService.showSuccessDialog(data.message, 'success')
        .then(() => {
          this.getVideos();
          this.modalService.dismissAll();
        });
      }
      else this.MessagesService.showSuccessDialog('Error al registrar libro.', 'error');
    })
    .catch(err => this.MessagesService.showSuccessDialog(err, 'error'))
  }

  getMaterias(modal, id_plan_estudio) {
    this.materias = null;
    this.materias2 = null;
    if(id_plan_estudio > 0 ){
      this.MessagesService.showLoading();

      let data = {
        id_plan_estudio: id_plan_estudio,
        connection: this.obtenerConnection(id_plan_estudio)
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
    this.video.id_materia = undefined;
  }

  getPlanEstudioChange(modal, id_plan_estudio) {
    this.getMaterias(modal, id_plan_estudio);
    this.getGeneraciones(id_plan_estudio);
  }

  resetForm(id_video) {
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
      id:id_video,
      id_usuario: sessionStorage.getItem('id'),
      connection: 0
    }
  }

  obtenerConnection(id_plan_estudio) {
    return this.programas.find(programa => programa.id == id_plan_estudio).connection;
  }
}
