import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { CitasService } from 'src/app/services/http-service/consejeria-estudiantil/citas/citas.service';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { ConsejeriaEstudiantilComponent } from '../consejeria-estudiantil.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-citas',
  templateUrl: 'citas.component.html',
  styleUrls: ['citas.component.css']
})
export class CitasComponent implements OnInit {
  registros: LocalDataSource = new LocalDataSource()
  movimientos: LocalDataSource = new LocalDataSource()
  formCita: UntypedFormGroup;
  formAsignacion: UntypedFormGroup;
  formFinal: UntypedFormGroup;
  programas: any = [];
  motivos: any = [];
  contactos: any = [];
  horarios: any = [];
  estatus: any = [];
  estatus2: any = [];
  consejeros: any = [];
  bandera: any = {
    loading: false,
    formulario: false,
    alumno: false,
    text: ''
  }
  @ViewChild('asignarEstatusConsejero') asignarEstatusConsejero: ElementRef;
  @ViewChild('historialMovimientos') historialMovimientos: ElementRef;
  settings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'asignar', title: '<i class="material-icons-outlined">edit</i>&nbsp;'},
        { name: 'historial', title: '<i class="material-icons-outlined">description</i>&nbsp;'}
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
      numero_empleado: {
        title: 'N. empleado',
        type: 'string',
        width: '15%'
      },
      nombre_alumno: {
        title: 'Nombre completo',
        type: 'string',
        width: '30%'
      },
      nombre_plan_estudio: {
        title: 'Plan de estudio',
        type: 'html',
        width: '20%',
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: ''
          }
        },
        filterFunction: (cell?: any, search?: string) => {
          if (cell == search) return search
        }
      },
      motivo_descripcion: {
        title: 'Motivo',
        type: 'string',
        width: '15%'
      },
      contacto: {
        title: 'Contacto',
        type: 'string',
        width: '15%'
      },
      horario: {
        title: 'Horario',
        type: 'string',
        width: '15%'
      },
      consejero: {
        title: 'Consejero',
        type: 'string',
        width: '25%'
      },
      estatus: {
        title: 'Estatus',
        type: 'html',
        width: '20%',
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: ''
          }
        }
      },
      fecha_registro: {
        title: 'Fecha de registro',
        type: 'string',
        filter: true,
        width: '15%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      },
      fecha_asignacion: {
        title: 'Fecha de asignación',
        type: 'string',
        filter: true,
        width: '15%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      }
    }
  };
  settings_movimientos = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
      position: 'right'
    },
    attr: {
      class: 'table table-bordered responsive'
    },
    pager: {
      perPage: 5,
    },
    columns: {
      nombre_alumno: {
        title: 'Nombre alumno',
        type: 'string',
        width: '30%'
      },
      movimiento: {
        title: 'Movimiento',
        type: 'string',
        width: '70%'
      }
    }
  };

  constructor(
    private citasHTTP: CitasService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
    private consejeria_estudiantil: ConsejeriaEstudiantilComponent,
    private formBuilder: UntypedFormBuilder
  ) {
    this.formCita = this.formBuilder.group({
      id_cita: [0, [Validators.required]],
      idmoodle: [0, [Validators.required]],
      numero_empleado: ['', [Validators.required]],
      nombre_alumno: ['', [Validators.required]],
      plan_estudio: [null, [Validators.required]],
      motivo: [null, [Validators.required]],
      contacto: [null, [Validators.required]],
      horario: [null, [Validators.required]],
      estatus: [null, [Validators.required]],
      consejero: [null],
      comentarios: [''],
      responsable: [null],
      connection: [null]
    });

    this.defaultFormCita();

    this.formAsignacion = this.formBuilder.group({
      id_cita: [0, [Validators.required]],
      idmoodle: [0],
      nombre_alumno: ['', [Validators.required]],
      plan_estudio: [null, [Validators.required]],
      motivo: [null, [Validators.required]],
      motivo_descripcion: ['', [Validators.required]],
      contacto: [null],
      horario: [null],
      detalle: [null],
      estatus: [null, [Validators.required]],
      consejero: [null],
      comentarios: [''],
      responsable: [null],
      connection: [null]
    });
  }

  ngOnInit(): void {
    this.programas = this.consejeria_estudiantil.getProgramasAcademicos();
    this.getFormulario();
    this.getCitas();
  }

  getFormulario() {
    this.citasHTTP.generico('getPlanesEstudio').then(datas => {
      var res: any = datas;
      this.settings.columns.nombre_plan_estudio.filter.config.list = res.resultado.dataDO.concat(res.resultado.dataAWS);
      this.settings = Object.assign({}, this.settings);
    });

    this.citasHTTP.generico('getMotivos').then(datas => {
      var res: any = datas;
      this.motivos = res.resultado;
    });

    this.citasHTTP.generico('getHorarios').then(datas => {
      var res: any = datas;
      this.horarios = res.resultado;
    });

    this.citasHTTP.generico('getEstatus', {tipo : 1, select: 0}).then(datas => {
      var res: any = datas;
      this.estatus = res.resultado;
    });

    this.citasHTTP.generico('getEstatus', {tipo : 2, select: 0}).then(datas => {
      var res: any = datas;
      this.estatus2 = res.resultado;
    });

    this.citasHTTP.generico('getEstatus', {tipo : 1, select: 1}).then(datas => {
      var res: any = datas;
      this.settings.columns.estatus.filter.config.list = res.resultado
      this.settings = Object.assign({}, this.settings)
    });

    this.citasHTTP.generico('getConsejeros').then(datas => {
      var res: any = datas;
      this.consejeros = res.resultado;
    });
  }

  defaultFormCita() {
    this.formCita.controls['id_cita'].setValue(0);
    this.formCita.controls['plan_estudio'].setValue(0);
    this.formCita.controls['motivo'].setValue(0);
    this.formCita.controls['contacto'].setValue('');
    this.formCita.controls['horario'].setValue(0);
    this.formCita.controls['estatus'].setValue(0);
    this.formCita.controls['consejero'].setValue(0);
    this.formCita.controls['connection'].setValue(0);
  }

  getCitas() {
    this.MessagesService.showLoading();
    this.citasHTTP.generico('getCitas').then(datas => {
      var res: any = datas;
      this.registros = res.resultado.dataDO.concat(res.resultado.dataAWS).sort((a, b) => {
        let fechaA: any = new Date(a.orden);
        let fechaB: any = new Date(b.orden);
        return fechaB - fechaA;
      });
      this.MessagesService.closeLoading();
    });
  }

  getAlumno() {
    this.bandera.alumno = false;
    this.bandera.formulario = false;
    if(this.formCita.value.numero_empleado && this.formCita.value.plan_estudio) {
      this.bandera.loading = true;
      let alumno: any = {
        numero_empleado: this.formCita.value.numero_empleado,
        id_plan_estudio: this.formCita.value.plan_estudio,
        connection: this.obtenerConnection(this.formCita.value.plan_estudio)
      }
      this.citasHTTP.generico('getAlumno', alumno).then(datas => {
        var res: any = datas;
        if(res.codigo == 0) {
          this.formCita.controls['nombre_alumno'].setValue('');
          this.contactos = [];
          this.bandera.formulario = false;
          this.bandera.loading = false;
          this.bandera.text = res.mensaje;
          this.bandera.alumno = true;
        }
        else {
          this.formCita.controls['idmoodle'].setValue(res.resultado[0].idmoodle);
          this.formCita.controls['nombre_alumno'].setValue(res.resultado[0].nombre_alumno);
          let data = {
            id_alumno: res.resultado[0].id_alumno,
            connection: this.obtenerConnection(this.formCita.value.plan_estudio)
          };
          this.citasHTTP.generico('getAlumnoTelefonos', data).then(datas => {
            var res: any = datas;
            this.contactos = res.resultado;
            this.bandera.loading = false;
            this.bandera.formulario = true;
          });
        }
      });
    }
  }

  validarEstatus(tipo: any) {
    if(tipo == 1) {
      if(this.formCita.value.estatus == 3) {
        this.formCita.controls['consejero'].disable()
        this.formCita.controls['consejero'].setValue(0)
      }
      else this.formCita.controls['consejero'].enable()
    }
    else {
      if(this.formAsignacion.value.estatus == 3) {
        this.formAsignacion.controls['consejero'].disable()
        this.formAsignacion.controls['consejero'].setValue(0)
      }
      else this.formAsignacion.controls['consejero'].enable()
    }
  }

  validarCita(tipo: any) {
    (tipo == 1 ? this.formFinal = this.formCita : this.formFinal = this.formAsignacion);
    this.formFinal.controls['responsable'].setValue(sessionStorage.getItem('id'));
    this.formFinal.controls['connection'].setValue(this.obtenerConnection(this.formFinal.value.plan_estudio));
    this.formFinal.value.consejero = (this.formFinal.value.consejero == undefined ? 0 : this.formFinal.value.consejero);
    this.formFinal.value.comentarios = (this.formFinal.value.comentarios == null ? '' : this.formFinal.value.comentarios);
    if (this.formFinal.valid) {
      let estatus = this.formFinal.value.estatus
      if((estatus == 2 || estatus == 5) && !this.formFinal.value.consejero) this.MessagesService.showSuccessDialog('Lo siento, para aplicar el estatus "' + (estatus = 2 ? 'Asignado' : 'Atendido') + '" se necesita seleccionar un consejero.', 'warning')
      else if(estatus == 7) {
        this.MessagesService.showConfirmDialog('¿Está seguro de que desea eliminar este registro?', '').then((result) => {
          if(result.isConfirmed) this.actualizarCita();
        });
      }
      else this.actualizarCita();
    }
    else this.MessagesService.showSuccessDialog('Todos los campos son obligatorios.', 'error');
  }

  actualizarCita() {
    this.MessagesService.showLoading();
    this.citasHTTP.generico('actualizarCita', this.formFinal.value).then(datas => {
      var res: any = datas;
      if(res.codigo == 0) this.MessagesService.showSuccessDialog(res.mensaje, 'error');
      else {
        if(res.resultado[0][0].success == 1) {
          this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'success')
          .then(() => {
            this.modalService.dismissAll();
            this.getCitas();
          });
        }
        else this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
      }
    });
  }

  resetAll() {
    this.formCita.reset();
    this.formAsignacion.reset();
    this.defaultFormCita();
    this.bandera.alumno = false;
    this.bandera.formulario = false;
  }

  openModal(modal) {
    this.resetAll();
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    });
  }

  onCustom(ev) {
    if(ev.action == 'asignar') {
      this.openModal(this.asignarEstatusConsejero);
      this.formAsignacion.controls['id_cita'].setValue(ev.data.id_cita);
      this.formAsignacion.controls['idmoodle'].setValue(0);
      this.formAsignacion.controls['plan_estudio'].setValue(ev.data.id_plan_estudio);
      this.formAsignacion.controls['nombre_alumno'].setValue(ev.data.nombre_alumno);
      this.formAsignacion.controls['motivo'].setValue(ev.data.motivo);
      this.formAsignacion.controls['motivo_descripcion'].setValue(ev.data.motivo_descripcion);
      this.formAsignacion.controls['contacto'].setValue('');
      this.formAsignacion.controls['horario'].setValue(0);
      this.formAsignacion.controls['detalle'].setValue(ev.data.detalle);
      this.formAsignacion.controls['estatus'].setValue(ev.data.id_estatus);
      let c = (ev.data.id_consejero == 0 ? '' : ev.data.id_consejero);
      this.formAsignacion.controls['consejero'].setValue(c);
      this.formAsignacion.controls['comentarios'].setValue(ev.data.comentarios);
    }
    else if(ev.action == 'historial') {
      this.MessagesService.showLoading();
      let cita = {
        id_cita: ev.data.id_cita,
        responsable: sessionStorage.getItem('id'),
        connection: this.obtenerConnection(ev.data.id_plan_estudio)
      }
      this.citasHTTP.generico('getMovimientos', cita).then(datas => {
        var res: any = datas;
        this.movimientos = res.resultado;
        this.openModal(this.historialMovimientos);
        this.MessagesService.closeLoading();
      });
    }
  }

  obtenerConnection(id_plan_estudio) {
    return this.programas.find(programa => programa.id == id_plan_estudio).connection;
  }

}