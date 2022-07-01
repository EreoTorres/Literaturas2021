import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { AsistentesService } from 'src/app/services/http-service/campanias-asistentes/campanias-asistentes.service';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-campanias-asistentes',
  templateUrl: 'campanias-asistentes.component.html',
  styleUrls: ['campanias-asistentes.component.css']
})
export class AsistentesComponent implements OnInit {
  @Input() registros: any;
  @Input() movimientos: any;
  @ViewChild('agregarAsistentes') links: ElementRef;
  formAsistentes: FormGroup;
  titulo: any = 'Registro de Asistentes';
  formFinal: FormGroup;
  regiones: any = [];
  planes_estudio: any = [];
  campanias: any = [];
  responsables: any = [];
  
  un_registro: any = {
    id_registro:0,
    region:'',
    nombre_plan_estudio: undefined,
    nombre_campania:'',
    mes:0,
    anio:10,
    responsable:'',
    asistentes:0,
    estatus:1
  }

  settings = {
    actions: {
      columnTitle: '',
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
      region: {
        title: 'Región',
        type: 'string',
        width: '15%'
      },
      nombre_plan_estudio: {
        title: 'Plan de estudio',
        type: 'string',
        width: '20%'
      },
      nombre_campania: {
        title: 'Nombre de la Campaña',
        type: 'string',
        width: '15%'
      },
      mes: {
        title: 'Mes',
        type: 'string',
        width: '10%'
      },
      anio: {
        title: 'Año',
        type: 'string',
        width: '10%'
      },
      responsable: {
        title: 'Responsable',
        type: 'string',
        width: '20%'
      },
      asistentes: {
        title: 'No. Asistentes',
        type: 'string',
        width: '10%'
      }
    }
  };

  constructor(
    private asistentesHTTP: AsistentesService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
    private formBuilder: FormBuilder
  ) {
    this.formAsistentes = this.formBuilder.group({
      region: [0, [Validators.required]],
      plan_estudio: [0, [Validators.required]],
      campania: [0, [Validators.required]],
      responsable: [0, [Validators.required]],
      cantidad: [0, [Validators.required]],
      id_usuario_reg: [0],
      estatus: [1],
      id_registro: [0]
    });

    this.defaultFormAsistentes();

  }

  ngOnInit(): void {
    this.getRegistros();
  }

  defaultFormAsistentes() {
    this.formAsistentes.controls['region'].setValue('');
    this.formAsistentes.controls['plan_estudio'].setValue('');
    this.formAsistentes.controls['campania'].setValue('');
    this.formAsistentes.controls['responsable'].setValue('');
    this.formAsistentes.controls['cantidad'].setValue(0);
  }

  getRegistros() {
    this.MessagesService.showLoading();
    this.asistentesHTTP.getRegistros().then(datas => {
      var res: any = datas;
      this.registros = res.resultado;
      this.MessagesService.closeLoading();
    });
  }

  getRegiones() {
    this.MessagesService.showLoading();
    this.asistentesHTTP.getRegiones().then(datas => {
      var res: any = datas;
      this.regiones = res.resultado
      this.MessagesService.closeLoading();
    });
  }

  getPlanes() {
    this.MessagesService.showLoading();
    this.planes_estudio = [];
    this.campanias = [];
    this.responsables = [];
    if(this.formAsistentes.value.region) {
      let datos: any = {
        id_region: this.formAsistentes.value.region
      }
      this.asistentesHTTP.getPlanes(datos).then(datas => {
        var res: any = datas;
        this.planes_estudio = res.resultado;
      });
    }

    this.MessagesService.closeLoading();
  }

  getCampanias(){
    this.MessagesService.showLoading();
    this.campanias = [];
    this.responsables = [];
    if(this.formAsistentes.value.plan_estudio && this.formAsistentes.value.region) {
      let datos: any = {
        id_region: this.formAsistentes.value.region,
        id_plan_estudio: this.formAsistentes.value.plan_estudio
      }
      this.asistentesHTTP.getCampaniasFiltrado(datos).then(datas => {
        var res: any = datas;
        this.campanias = res.resultado;
        
      });
    }

    this.MessagesService.closeLoading();
  }

  getResponsables(){
    this.MessagesService.showLoading();
    this.responsables = [];
    if(this.formAsistentes.value.campania) {
      let datos: any = {
        id_campania: this.formAsistentes.value.campania
      }
      this.asistentesHTTP.getResponsables(datos).then(datas => {
        var res: any = datas;
        this.responsables = res.resultado;
      });
    }

    this.MessagesService.closeLoading();
  }

  validarAsistentes() {
    this.formFinal = this.formAsistentes;
    this.formFinal.controls['id_usuario_reg'].setValue(sessionStorage.getItem('id'));
    this.formFinal.controls['id_registro'].setValue(this.un_registro.id_registro);
    this.formFinal.controls['estatus'].setValue(this.un_registro.estatus);
    if (this.formFinal.valid) {
      this.actualizarAsistentes();
    }
    else this.MessagesService.showSuccessDialog('Todos los campos son obligatorios.', 'error');
  }

  actualizarAsistentes() {
    this.MessagesService.showLoading();
    this.asistentesHTTP.guardaRegistro(this.formFinal.value).then(datas => {
      var res: any = datas;
      if(res.codigo == 0) this.MessagesService.showSuccessDialog(res.mensaje, 'error');
      else {
        if(res.resultado[0][0].success == 1) {
          this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'success')
          .then(() => {
            this.modalService.dismissAll();
            this.getRegistros();
          });
        }
        else this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
      }
    });
  }

  resetAll() {
    this.formAsistentes.reset();
    this.getRegiones();
    this.planes_estudio = [];
    this.campanias = [];
    this.responsables = [];
    this.defaultFormAsistentes();
    this.formAsistentes.enable();
  }

  getUnRegistro(un_registro){
    this.MessagesService.showLoading();
    this.asistentesHTTP.getUnRegistro(un_registro).then(datas => {
      var res: any = datas;
      this.formAsistentes.controls['region'].setValue(res.resultado[0].id_region);
      this.getPlanes();
      this.formAsistentes.controls['plan_estudio'].setValue(res.resultado[0].id_plan_estudio);
      this.getCampanias();
      this.formAsistentes.controls['campania'].setValue(res.resultado[0].id_campania);
      this.getResponsables();
      this.formAsistentes.controls['responsable'].setValue(res.resultado[0].id_responsable);
      this.formAsistentes.controls['cantidad'].setValue(res.resultado[0].asistentes);
      this.formAsistentes.controls['campania'].disable();
      this.formAsistentes.controls['plan_estudio'].disable();
      this.formAsistentes.controls['responsable'].disable();
      this.formAsistentes.controls['region'].disable();
      this.MessagesService.closeLoading();
    });
  }

  resetForm(_id_registro){
    this.un_registro = {
      id_registro:_id_registro,
      region:'',
      nombre_plan_estudio: undefined,
      nombre_campania:'',
      mes:0,
      anio:10,
      responsable:'',
      asistentes:0,
      estatus:1,
      id_usuario: sessionStorage.getItem('id')
    }
  }
  openModal(_id_registro){
    this.modalService.open(this.links, {
      backdrop: 'static',
      keyboard: false,  // to prevent closing with Esc button (if you want this too)
      size: 'xl'
    }); 
    this.resetAll();
    this.resetForm(_id_registro); 
    this.titulo = "Registro de Asistentes";
    if(_id_registro > 0)
    {
      this.titulo = "Editar No. de Asistentes";
      this.getUnRegistro(this.un_registro);
    }
  }

  onCustom(ev) {
    if(ev.action == 'editar'){
      this.openModal(ev.data.id);
    }
    else if(ev.action == 'eliminar') {
      this.un_registro.id_registro = ev.data.id;
      this.un_registro.estatus = 0;
      this.MessagesService.showConfirmDialog('¿Seguro que deseas eliminar el registro?', '').then((result) => {
        if(result.isConfirmed) {
          this.MessagesService.showLoading();
          this.asistentesHTTP.guardaRegistro(this.un_registro)
          .then(data => {
            this.MessagesService.closeLoading();
            if(data['codigo'] == 200) {
              this.MessagesService.showSuccessDialog(data['resultado'][0].message, 'success').then((result) => {
                if(result.isConfirmed) this.getRegistros();
              })
            }
            else this.MessagesService.showSuccessDialog('Ocurrio un error al eliminar el registro.', 'error');
          });
        }
      });
    }
  }

}
