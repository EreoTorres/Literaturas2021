import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as EventEmitter from 'events';
import { LiteraturasService } from 'src/app/services/http-service/academica/literaturas/literaturas.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';

@Component({
  selector: 'app-literaturas',
  templateUrl: './literaturas.component.html',
  styleUrls: ['./literaturas.component.css']
})

export class LiteraturasComponent implements OnInit {
  @Input() registros: any;

  pagination: any;
  pagination2: any;
  programas: any = [];
  materias: any;
  materias2: any;
  tipofiltro: any = '1';
  files: File[] = [];
  obj_detalle: any = 0;
  mp_estuadios: any = 0;
  listalinks: any;
  date: any;
  filtrotxt: any = '';
  titulo_literatura: any = 'Agregar Literaturas';
  copiatodo: any = '';

  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'descarga', title: '<i class="material-icons-outlined">cloud_download</i>&nbsp;'},
        { name: 'copiar_link', title: '&nbsp;<i class="material-icons-outlined">link</i>' },
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
      nombre_archivo: {
        title: 'Nombre',
        type: 'string',
        width: '20%'
      },
      nombre_plan_estudio: {
        title: 'Plan de estudio',
        type: 'string',
        width: '15%'
      },
      nombre_materia: {
        title: 'Materia',
        type: 'string',
        width: '15%'
      },
      fecha_modificacion: {
        title: 'Fecha de modificación',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      }
    }
  };

  constructor(
    private literaturasHTTP: LiteraturasService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
  ) { }

  ngOnInit(): void {
    this.getProgramasAcademicos();
    this.getLiteraturas();
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
  }

  getLiteraturas(){
    this.MessagesService.showLoading();
    this.literaturasHTTP.getListados().then(datas => {
      var res: any = datas;
      this.registros = res.resultado.dataDO.concat(res.resultado.dataAWS).sort((a, b) => {
        let fechaA: any = new Date(a.orden);
        let fechaB: any = new Date(b.orden);
        return fechaB - fechaA;
      });
      this.MessagesService.closeLoading();
    });
  }

  getMaterias(modal, id_plan_estudio){
    if(id_plan_estudio > 0 ){
      this.MessagesService.showLoading();

      let data = {
        id_plan_estudio: id_plan_estudio,
        connection: this.obtenerConnection(id_plan_estudio)
      };

      this.literaturasHTTP.getMaterias(data).then(datas => {
        var res: any = datas;
        this.MessagesService.closeLoading();
  

        if(modal != 1){
          this.materias = res.resultado
          this.getLiteraturas();
        }else{
          this.materias2 = res.resultado
        }
      });
    }else{
      this.materias = null;
      this.getLiteraturas();
    }
  }

  openModal(docs){
    this.modalService.open(docs, {
      backdrop: 'static',
      keyboard: false,  // to prevent closing with Esc button (if you want this too)
      size: 'xl'
    }); 
  }

  onCustom(ev){
    if(ev.action == 'copiar_link'){
      this.copyMessage(ev.data.ruta_publica);
    }else{
      var url = environment.urlProduccion+'academica/literaturas/streamdoc/'+
      ev.data.id_plan_estudio+'/'+
      ev.data.idmoodle_materia+'/'+
      ev.data.nombre_archivo;

      window.open(url, "_blank");
    }
  }

  onSelect(event) {
    for (var i = 0; i < event.addedFiles.length; i++) {
      var repetido = 0;

      for (var a = 0; a < this.files.length; a++) {
        if(event.addedFiles[i].name == this.files[a].name){
          repetido = 1
        }
      }

      if(repetido == 0){
        this.files.push(event.addedFiles[i]);
      }else{
        this.MessagesService.showSuccessDialog(
          "El siguiente archivo está repetido: "+
          event.addedFiles[i].name,
          'error'
        )
      }
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  guardar(modal,links){
    if(this.obj_detalle == 0 && !this.obj_detalle){
      this.MessagesService.showSuccessDialog(
        "El plan de estudio y materia son requeridos",
        'error'
      );
      return;
    }

    if(this.files.length == 0){
      this.MessagesService.showSuccessDialog(
        "Los archivos son requeridos",
        'error'
      );
      return;
    }

    const formData = new FormData();      
    var detalle = JSON.parse(this.obj_detalle);
    detalle.id_usuario = sessionStorage.getItem('id');

    const blobOverrides = new Blob([JSON.stringify(detalle)], {
      type: 'application/json',
    });

    formData.append('data', blobOverrides);
    
    for (var i = 0; i < this.files.length; i++) { 
      formData.append("file", this.files[i]);
    }

    modal.close('Save click');
    this.MessagesService.showLoading();

    this.literaturasHTTP.setLiteraturas(formData).then(datas => {
      var res: any = datas;
      this.MessagesService.closeLoading();

      if(res.codigo == 200){
        this.listalinks = res.resultado;
        var cont = 0;

        for(let datos of this.listalinks){
          if(this.listalinks.length != cont && cont != 0){
            this.copiatodo += ' , ';
          }

          this.copiatodo += datos.ruta_publica;
          cont++;
        }
        
        this.MessagesService.showSuccessDialog(
          "Los archivos fueron guardados correctamente",
          'success'
        ).then(() => {
          this.openModal(links);
        });
      }else{
        this.MessagesService.showSuccessDialog(
          "Problemas al guardar los archivos",
          'error'
        ).then(() => {
          this.openModal(links);
        });
      }
    });
  }

  cerrarModal(){
    this.files = [];
    this.obj_detalle = 0;
    this.materias2 = null;
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = '';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  obtenerConnection(id_plan_estudio) {
    return this.programas.find(programa => programa.id == id_plan_estudio).connection;
  }
}
