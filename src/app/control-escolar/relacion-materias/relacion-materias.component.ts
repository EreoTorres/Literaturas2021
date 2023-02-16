import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { ValidTipoTextService } from 'src/app/services/validaciones/valid-tipo-text.service';
import * as EventEmitter from 'events';
import { InputprogramasComponent } from 'src/app/components/inputprogramas/inputprogramas.component';
import { RelacionMateriasService } from 'src/app/services/http-service/control-escolar/relacion-materias/relacion-materias.service';
import { InputprogramasAllComponent } from 'src/app/components/inputprogramas-all/inputprogramas-all.component';

@Component({
  selector: 'app-relacion-materias',
  templateUrl: './relacion-materias.component.html',
  styleUrls: ['./relacion-materias.component.css']
})
export class RelacionMateriasComponent implements OnInit {
  @Output() setView = new EventEmitter();
  @Output() getRegistros = new EventEmitter();
  @Input() registros: any;
  @ViewChild('docs2') docs2;

  pagination: any;
  programas: any = [];
  tipofiltro: any = '1';
  date: any;
  filtrotxt: any = '';
  titulo_videos: any = 'Agregar Relacion';
  planestudio_f: any = 0;
  formulario: UntypedFormGroup;
  planes_autoridad: any;
  id_plan_estudio: any = 0;
  id_plan_autoridad: any = 0;
  materias_plan: any = [];
  materias_autoridad: any = [];
  id_materia_programa: any = 0;
  id_materia_autoridad: any = 0;
  id_relacion: any = 0;

  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'editar', title: '<i class="material-icons-outlined">edit</i>&nbsp;' },
      ],
      position: 'right'
    },
    delete: {
      deleteButtonContent: '<i class="material-icons-outlined">delete</i>',
    },
    attr: {
      class: 'table table-bordered responsive'
    },
    pager: {
      display: false,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'string',
        width: '10%',
        editable: false,
        addable: false,
        filter: false
      },
      nombre_materia_autoridad: {
        title: 'Materia Autoridad',
        type: 'string',
        width: '20%',
      },
      
      /*nombre_plan_estudio_autoridad: {
        title: 'Autoridad',
        type: 'string',
        width: '10%',
        editable: false,
        addable: false,
        filter: false
      },
      nombre_plan_estudio: {
        title: 'Plan de estudios',
        type: 'string',
        width: '10%',
        editable: false,
        addable: false,
        filter: false
      },*/
      nombre_materia: {
        title: 'Materia Plan de estudios',
        type: 'string',
        filter: true
      },
      fecha_registro: {
        title: 'Fecha de registro',
        type: 'string',
        width: '15%',
        editable: false,
        addable: false,
        filter: true
      }
    }
  };

  constructor(
    private relacionHTTP: RelacionMateriasService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
    private datePipe: DatePipe,
    public validText: ValidTipoTextService
  ) {
  }

  ngOnInit(): void {
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getProgramasAcademicos();
    this.getAutoridad();
    this.getRelacion();
  }

  onCustomAction(event) {

    this.id_materia_programa = event.data.id_materia;
    this.id_materia_autoridad = event.data.id_materia_autoridad;
    this.id_relacion = event.data.id;

    this.openModal(this.docs2);
  }


  getAutoridad() {
    this.relacionHTTP.getAutoridad().then(datas => {
      var res: any = datas;
      this.planes_autoridad = res.resultado
      this.MessagesService.closeLoading();
    });
  }

  getMaterias(id, plan_autoridad: any = 1) {
    if(id != 0){
      this.relacionHTTP.getMaterias({ id_plan_estudio: id, tipo: plan_autoridad }).then(datas => {
        var res: any = datas;
  
        if (plan_autoridad == 1) {
          this.materias_plan = res.resultado
        } else {
          this.materias_autoridad = res.resultado
        }
  
        this.MessagesService.closeLoading();
      });
    }
  }

  guardar(){
    if(this.id_materia_autoridad == 0 || this.id_materia_programa == 0){
      this.MessagesService.showSuccessDialog(
        "Las dos materias son requeridas",
        'error'
      );
      return;
    }

    var datos = {id: this.id_relacion,id_materia: this.id_materia_programa,id_plan_estudio: this.id_plan_estudio,id_materia_autoridad: this.id_materia_autoridad, id_autoridad: this.id_plan_autoridad};
    this.MessagesService.showLoading();

    this.relacionHTTP.setRelaciones(datos).then(datas => {
      var res: any = datas;
      this.MessagesService.closeLoading();

      if(res.resultado[0].success == 0){
        this.MessagesService.showSuccessDialog(
          res.resultado.message,
          'error'
        );
      }else{
        this.MessagesService.showSuccessDialog(
          "La relacion se guardo correctamente",
          'success'
        ).then(() => {
          this.id_relacion = 0;
          this.id_materia_programa = 0;
          this.id_materia_autoridad = 0;
          
          this.modalService.dismissAll();
          this.getRelacion();
        });
      }
    });
  }

  getProgramasAcademicos() {
    for (let datos of JSON.parse(localStorage.getItem('programas'))) {
      this.programas.push({ id: datos.id, nombre_corto: datos.nombre_corto })
    }
  }

  getRelacion() {
    if(this.id_plan_estudio != 0 && this.id_plan_autoridad != 0){
      this.MessagesService.showLoading();
      this.relacionHTTP.getRelacion({ id_plan_estudio: this.id_plan_estudio, id_plan_autodiad: this.id_plan_autoridad }).then(datas => {
        var res: any = datas;
        this.registros = res.resultado
        this.getMaterias(this.id_plan_estudio,1);
        this.getMaterias(this.id_plan_autoridad,2);
  
        this.MessagesService.closeLoading();
      });
    }
  }

  openModal(docs){
    this.modalService.open(docs, {
      backdrop: 'static',
      keyboard: false,  // to prevent closing with Esc button (if you want this too)
      size: 'xl'
    }); 
  }

}
