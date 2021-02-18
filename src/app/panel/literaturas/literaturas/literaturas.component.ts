import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as EventEmitter from 'events';
import { LiteraturasService } from 'src/app/services/http-service/literaturas/literaturas.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-literaturas',
  templateUrl: './literaturas.component.html',
  styleUrls: ['./literaturas.component.css']
})
export class LiteraturasComponent implements OnInit {

  @Output() setView  = new EventEmitter();
  @Output() getRegistros  = new EventEmitter();
  @Input() registros: any;

  pagination: any;
  pagination2: any;
  programas: any;
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
  constructor(
    private literaturasHTTP: LiteraturasService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getProgramasAcademicos();

    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getProgramasAcademicos(){
    this.MessagesService.showLoading();
    this.literaturasHTTP.getProgramasAcademicos().then(datas => {
      var res: any = datas;
      this.MessagesService.closeLoading();

      this.programas = res.resultado
    });
  }

  getMaterias(modal,id_planestudio){
    if(id_planestudio > 0 ){
      this.MessagesService.showLoading();

      this.literaturasHTTP.getMaterias(id_planestudio).then(datas => {
        var res: any = datas;
        this.MessagesService.closeLoading();
  

        if(modal != 1){
          this.materias = res.resultado
          this.getLiteraturas(this.tipofiltro,'{"id_plan_estudio": '+id_planestudio+'}');
        }else{
          this.materias2 = res.resultado
        }
      });
    }else{
      this.materias = null;
      this.getLiteraturas(0,{id_plan_estudio: ''});
    }
  }

  getLiteraturas(tipo: any,objfiltro){
    var filtrado = {tipofiltro: tipo, filtro: objfiltro};

    if(tipo == 1){
      filtrado.filtro = this.filtrotxt;
    }else if(tipo == 2){
      filtrado.filtro = JSON.parse(objfiltro);
    }else{
      filtrado.filtro = this.date;
    }

    this.literaturasHTTP.getListados(filtrado).then(datas => {
      var res: any = datas;

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

        this.getLiteraturas(0,{id_plan_estudio: ''});
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
}
