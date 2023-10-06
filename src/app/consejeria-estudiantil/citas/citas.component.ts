import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { CitasService } from 'src/app/services/http-service/consejeria-estudiantil/citas/citas.service';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { AppComponent } from 'src/app/app.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/http-service/global-functions/global-functions.service';

@Component({
  selector: 'app-citas',
  templateUrl: 'citas.component.html',
  styleUrls: ['citas.component.css']
})

export class CitasComponent implements OnInit {
  id_cita: any = 0;
  id_plan_estudio: any = 0;
  registros: LocalDataSource = new LocalDataSource()
  comentarios: LocalDataSource = new LocalDataSource()
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
  citaEstatus: any = [];
  citaMaterias: any = [];
  citaCumplimientos: any = [];
  bandera: any = {
    loading: false,
    formulario: false,
    alumno: false,
    text: ''
  }
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
        filterFunction: (cell ?: any, search ?: string) => {
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
  settings_comentarios = {
    actions: {
      columnTitle: 'Opciones',
      add: true,
      edit: true,
      delete: true
    },
    add: {
      addButtonContent: '<i class="material-icons-outlined add">add_box</i>',
      createButtonContent: '<i class="material-icons-outlined">save</i>',
      cancelButtonContent: '<i class="material-icons-outlined">close</i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="material-icons-outlined">edit</i>',
      saveButtonContent: '<i class="material-icons-outlined">save</i>',
      cancelButtonContent: '<i class="material-icons-outlined">close</i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="material-icons-outlined">delete</i>',
      confirmDelete: true
    },
    attr: {
      class: 'table table-bordered responsive'
    },
    pager: {
      perPage: 20,
    },
    columns: {
      id_cita_comentario: {
        hide: true
      },
      num_cita: {
        title: 'No. cita',
        type: 'html',
        width: '10%',
        editable:false,
        addable: false
      },
      fecha_cita: {
        title: 'Fecha cita',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      },
      id_estatus: {
        hide: true
      },
      estatus_cita: {
        title: 'Estatus cita',
        type: 'html',
        width: '15%',
        editor: {
          type: 'list',
          config: {
            selectText: 0,
            list: ''
          }
        }
      },
      id_materia: {
        hide: true
      },
      materia_compromiso: {
        title: 'Materia compromiso',
        type: 'html',
        width: '15%',
        editor: {
          type: 'list',
          config: {
            selectText: 0,
            list: []
          }
        }
      },
      id_cumplimiento: {
        hide: true
      },
      cumplimiento: {
        title: 'Cumplimiento',
        type: 'html',
        width: '15%',
        editor: {
          type: 'list',
          config: {
            selectText: 0,
            list: ''
          }
        }
      },
      comentarios: {
        title: 'Comentarios',
        type: 'string',
        width: '40%',
        editor: {
          type: 'textarea',
        }
      },
      estatus: {
        hide: true
      },
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
    private messagesService: MessagesService,
    private app: AppComponent,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private globalFunctions: GlobalFunctionsService
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
      responsable: [null],
      connection: [null]
    });
  }

  ngOnInit(): void {
    this.messagesService.showLoading();
    this.id_cita = this.route.snapshot.paramMap.get('id');
    this.id_plan_estudio = this.route.snapshot.paramMap.get('plan');
    this.programas = this.app.getProgramasAcademicos();
    this.getFormulario();
    if(this.id_cita && this.id_plan_estudio) this.getCita();
    else {
      this.id_cita = 0;
      this.getCitas();
    }
  }

  getFormulario() {
    if(!this.id_cita) {
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

      this.citasHTTP.generico('getEstatus', {tipo : 1, select: 1}).then(datas => {
        var res: any = datas;
        this.settings.columns.estatus.filter.config.list = res.resultado
        this.settings = Object.assign({}, this.settings)
      });
    }

    this.citasHTTP.generico('getEstatus', {tipo : 2, select: 0}).then(datas => {
      var res: any = datas;
      this.estatus2 = res.resultado;
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
    this.messagesService.showLoading();
    this.citasHTTP.generico('getCitas').then(datas => {
      var res: any = datas;
      this.registros = res.resultado.dataDO.concat(res.resultado.dataAWS).sort((a, b) => {
        let fechaA: any = new Date(a.orden);
        let fechaB: any = new Date(b.orden);
        return fechaB - fechaA;
      });
      this.messagesService.closeLoading();
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
        connection: this.app.obtenerConnection(this.formCita.value.plan_estudio)
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
          this.formCita.controls['estatus'].setValue(1);
          let data = {
            id_alumno: res.resultado[0].id_alumno,
            connection: this.app.obtenerConnection(this.formCita.value.plan_estudio)
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

      // GUARDAR AUTOMÁTICO
      this.validarCita(2)
    }
  }

  validarCita(tipo: any) {
    this.formFinal = (tipo == 1 ? this.formCita : this.formAsignacion);
    this.formFinal.controls['responsable'].setValue(sessionStorage.getItem('id'));
    this.formFinal.controls['connection'].setValue(this.app.obtenerConnection(this.formFinal.value.plan_estudio));
    if (this.formFinal.valid) {
      if(!this.formFinal.value.consejero || this.formFinal.value.consejero == undefined) this.formFinal.value.consejero = 0;
      let estatus = this.formFinal.value.estatus;
      if((estatus == 2 || estatus == 5) && !this.formFinal.value.consejero) {
        this.messagesService.showSuccessDialog('Lo siento, para aplicar el estatus "' + (estatus = 2 ? 'Asignado' : 'Atendido') + '" se necesita seleccionar un consejero.', 'warning');
      }
      else if(estatus == 7) {
        this.messagesService.showConfirmDialog('¿Está seguro de que desea eliminar este registro?', '').then((result) => {
          if(result.isConfirmed) this.actualizarCita();
        });
      }
      else this.actualizarCita();
    }
    else this.messagesService.showSuccessDialog('Campo obligatorio.', 'error');
  }

  actualizarCita() {
    this.messagesService.showLoading();
    this.citasHTTP.generico('actualizarCita', {cita: this.formFinal.value}).then(datas => {
      var res: any = datas;
      if(res.codigo == 0) this.messagesService.showSuccessDialog(res.mensaje, 'error');
      else {
        if(!res.resultado[0][0].success) this.messagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
        else {
          this.messagesService.showSuccessDialog(res.resultado[0][0].message, 'success').then(() => {
            if(!this.id_cita) {
              this.modalService.dismissAll();
              this.getCitas();
            }
          });
        }
      }
    });
  }

  getCita() {
    let info = {
      id_cita: this.id_cita,
      id_plan_estudio: this.id_plan_estudio,
      connection: this.app.obtenerConnection(this.id_plan_estudio)
    }
    this.citasHTTP.generico('getCitaInfo', info)
    .then(data => {
      let cita_info = data['resultado'];
      this.settings_comentarios.columns.estatus_cita.editor.config.list = cita_info['estatus'];
      this.citaEstatus = cita_info['estatus'];
      this.settings_comentarios.columns.materia_compromiso.editor.config.list = cita_info['materias'];
      this.citaMaterias = cita_info['materias'];
      this.settings_comentarios.columns.cumplimiento.editor.config.list = cita_info['cumplimientos'];
      this.citaCumplimientos = cita_info['cumplimientos'];
      this.settings_comentarios = Object.assign({}, this.settings_comentarios);
      this.comentarios = cita_info['cita_comentarios'];
      this.getNumCita(2);
      return this.citasHTTP.generico('getCitas', info);
    })
    .then(data => {
      data = data['resultado'][0];
      this.formAsignacion.controls['id_cita'].setValue(this.id_cita);
      this.formAsignacion.controls['idmoodle'].setValue(0);
      this.formAsignacion.controls['plan_estudio'].setValue(data['id_plan_estudio']);
      this.formAsignacion.controls['nombre_alumno'].setValue(data['nombre_alumno']);
      this.formAsignacion.controls['motivo'].setValue(data['motivo']);
      this.formAsignacion.controls['motivo_descripcion'].setValue(data['motivo_descripcion']);
      this.formAsignacion.controls['contacto'].setValue('');
      this.formAsignacion.controls['horario'].setValue(0);
      this.formAsignacion.controls['detalle'].setValue(data['detalle']);
      this.formAsignacion.controls['estatus'].setValue(data['id_estatus']);
      let c = (data['id_consejero'] == 0 ? '' : data['id_consejero']);
      this.formAsignacion.controls['consejero'].setValue(c);
      this.messagesService.closeLoading();
    })
    .catch(err => this.messagesService.showSuccessDialog(err, 'error'));
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

  guardar_actualizar(ev: any, tipo: any) {
    let data;
    if(tipo == 3) {
      data = ev.data;
      data.estatus = 0;
    }
    else data = ev.newData;

    (!data.id_cita_comentario ? data.id_cita_comentario = 0 : '');
    if(tipo == 2) {
      data.num_cita = this.getNumCita();
      data.estatus = 1;
    }
    
    data.fecha = this.globalFunctions.newUYDate(data.fecha_cita);
    data.id_estatus = (data.estatus_cita ? this.citaEstatus.find(d => d.value == data.estatus_cita).id : 0);
    data.id_materia = (data.materia_compromiso ? this.citaMaterias.find(d => d.value == data.materia_compromiso).id : 0);
    data.id_cumplimiento = (data.cumplimiento ? this.citaCumplimientos.find(d => d.value == data.cumplimiento).id : 0 );

    if(tipo == 3) {
      this.messagesService.showConfirmDialog('¿Seguro que deseas eliminar el comentario?', '').then((result) => {
        if(result.isConfirmed) this.actualizarCitaComentarios(tipo, ev, data);
      });
    }
    else this.actualizarCitaComentarios(tipo, ev, data);
  }

  actualizarCitaComentarios(tipo: any, ev: any, data: any) {
    this.messagesService.showLoading();
    this.formAsignacion.controls['responsable'].setValue(sessionStorage.getItem('id'));
    this.formAsignacion.controls['connection'].setValue(this.app.obtenerConnection(this.formAsignacion.value.plan_estudio));
    this.citasHTTP.generico('actualizarCitaComentarios', {cita: this.formAsignacion.value, comentarios: data}).then(datas => {
      var res: any = datas;
      if(res.codigo == 0) this.messagesService.showSuccessDialog(res.mensaje, 'error');
      else {
        if(!res.resultado[0][0].success) this.messagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
        else {
          data.id_cita_comentario = res.resultado[0][0].id_cita_comentario;
          this.messagesService.showSuccessDialog(res.resultado[0][0].message, 'success').then(() => {
            if(tipo == 3) {
              ev.confirm.resolve();
              this.getNumCita(2);
            }
            else ev.confirm.resolve(data);
          });
        }
      }
    });
  }

  getNumCita(tipo: any = 1) {
    let data = Object.values(this.comentarios);
    let length = data.filter(d => d.estatus == 1).length + 1;
    let num_cita = length;
    for (let i = 0; i < data.length; i++) {
      if(data[i].estatus) {
        num_cita--;
        data[i].num_cita = num_cita;
      }
    }

    if(tipo == 1) return length;
  }

  onCustom(ev) {
    if(ev.action == 'asignar') {
      this.messagesService.showLoading();
      this.router.navigate(['consejeria-estudiantil/citas/cita', ev.data.id_cita, ev.data.id_plan_estudio]);
    }
    else if(ev.action == 'historial') {
      this.messagesService.showLoading();
      let cita = {
        id_cita: ev.data.id_cita,
        responsable: sessionStorage.getItem('id'),
        connection: this.app.obtenerConnection(ev.data.id_plan_estudio)
      }
      this.citasHTTP.generico('getMovimientos', cita).then(datas => {
        var res: any = datas;
        this.movimientos = res.resultado;
        this.openModal(this.historialMovimientos);
        this.messagesService.closeLoading();
      });
    }
  }
}