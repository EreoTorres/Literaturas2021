import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CertificacionesService } from 'src/app/services/http-service/academica/certificaciones/certificaciones.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { SmartTableDatepickerComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { GlobalFunctionsService } from 'src/app/services/http-service/global-functions/global-functions.service'; 

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['../literaturas/literaturas.component.css']
})
export class CertificacionesComponent implements OnInit {
  @Input() registros: any;
  programas: any = [];
  formCertificacion: UntypedFormGroup;
  certificaciones: any = [];
  estadoVisible: any = [
    {
      id: 'Si',
      nombre: 'Si'
    },
    {
      id: 'No',
      nombre: 'No'
    }
  ]
  planes_estudio: any = [
    {
      id: 'TODOS',
      nombre: 'TODOS'
    },
    {
      id: 'COPPEL',
      nombre: 'COPPEL'
    },
    {
      id: 'UMI',
      nombre: 'UMI'
    }
  ];
  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: false,
      edit: true,
      delete: false
    },
    edit: {
      editButtonContent: '<i class="material-icons-outlined">edit</i>',
      saveButtonContent: '<i class="material-icons-outlined">save</i>',
      cancelButtonContent: '<i class="material-icons-outlined">close</i>',
      confirmSave: true
    },
    attr: {
      class: 'table table-bordered responsive'
    },
    pager: {
      perPage: 10,
    },
    columns: {
      plan_estudio: {
        title: 'Plan de estudio',
        type: 'html',
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: [
              {
                value: 'COPPEL',
                title: 'COPPEL'
              },
              {
                value: 'UMI',
                title: 'UMI'
              }
            ],
          },
        },
        editable: false,
        width: '8%'
      },
      nombre: {
        title: 'Nombre',
        type: 'string',
        width: '20%',
        editable: false,
        addable: false
      },
      fecha_inicio: {
        title: 'Fecha inicio',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
          config: {
            placeholder: 'Fecha inicio'
          }
        },
      },
      fecha_fin: {
        title: 'Fecha fin',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
          config: {
            placeholder: 'Fecha fin'
          }
        },
      },
      url: {
        title: 'Url',
        type: 'string',
        width: '20%'
      },
      visible: {
        title: 'Visible',
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [
              {
                value: 'Si',
                title: 'Si'
              },
              {
                value: 'No',
                title: 'No'
              }
            ],
          },
        },
        width: '10%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [
              {
                value: 'Si',
                title: 'Si'
              },
              {
                value: 'No',
                title: 'No'
              }
            ],
          },
        }
      }
    }
  };

  fecha_actual:any = new Date();

  constructor(
    private certificacionesHTTP: CertificacionesService,
    private modalService: NgbModal,
    private messagesService: MessagesService,
    private formBuilder: UntypedFormBuilder,
    private globalFunctions: GlobalFunctionsService
  ) {
    this.formCertificacion = this.formBuilder.group({
      id_certificacion: [null, [Validators.required]],
      fecha_inicio: [null, [Validators.required]],
      fecha_fin: [null, [Validators.required]],
      plan_estudio: [null, [Validators.required]],
      url: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fecha_actual = this.fecha_actual.toISOString().split('T')[0];
    this.getCertificaciones();
    this.getListaCertificaciones();
  }

  getCertificaciones() {
    this.messagesService.showLoading();
    this.certificacionesHTTP.getCertificaciones()
    .then(datas => {
      var res: any = datas;
      this.registros = res.resultado[0]
      this.messagesService.closeLoading();
    });
  }

  getListaCertificaciones() {
    this.messagesService.showLoading();
    this.certificacionesHTTP.getListaCertificaciones()
    .then(datas => {
      var res: any = datas;
      this.certificaciones = res.resultado;
    });
  }

  openModal(modal) {
    this.defaultFormCertificacion();
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    });
  }

  defaultFormCertificacion() {
    this.formCertificacion.controls['id_certificacion'].setValue('');
    this.formCertificacion.controls['fecha_inicio'].setValue('');
    this.formCertificacion.controls['fecha_fin'].setValue('');
    this.formCertificacion.controls['plan_estudio'].setValue('');
    this.formCertificacion.controls['url'].setValue('');
  }

  actualizarCertificacion(ev) {
    let data: any = {};
    if(ev) {
      if(!ev.newData.url) {
        this.messagesService.showSuccessDialog('Url es obligatorio.', 'error');
        return false;
      }
      else {
        data = ev.newData
        data.fecha_inicio = this.globalFunctions.fecha(data.fecha_inicio)
        data.fecha_fin = this.globalFunctions.fecha(data.fecha_fin)
      }
    }
    else {
      if (!this.formCertificacion.valid) {
        this.messagesService.showSuccessDialog('Todos los campos son obligatorios.', 'error');
        return false;
      }
      else data = this.formCertificacion.value

      if(data.fecha_inicio < this.fecha_actual) {
        this.messagesService.showSuccessDialog('La fecha inicio es inválida.', 'warning');
        return false;
      }
    }

    if(data.fecha_fin < this.fecha_actual) {
      this.messagesService.showSuccessDialog('La fecha fin es inválida.', 'warning');
      return false;
    }

    if(data.fecha_inicio > data.fecha_fin) {
      this.messagesService.showSuccessDialog('La fecha fin de no puede ser mayor a la fecha inicio.', 'warning');
      return false;
    }

    this.messagesService.showLoading();
    this.certificacionesHTTP.actualizarCertificacion(data).then(datas => {
      var res: any = datas;
      if(res.codigo == 0) this.messagesService.showSuccessDialog(res.mensaje, 'error');
      else {
        if(res.resultado[0][0].success == 1) {
          this.messagesService.showSuccessDialog(res.resultado[0][0].message, 'success')
          .then(() => {
            this.modalService.dismissAll();
            this.getCertificaciones();
          });
        }
        else this.messagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
      }
    });
  }

}
