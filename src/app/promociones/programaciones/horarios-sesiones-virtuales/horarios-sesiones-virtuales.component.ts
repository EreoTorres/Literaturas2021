import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EstatusSelectComponent } from 'src/app/components/estatus-select-component/estatus-select.component';
import { InputprogramasComponent } from 'src/app/components/inputprogramas/inputprogramas.component';
import { NumberComponentDynamicComponent } from 'src/app/components/number-component-dynamic/number-component-dynamic.component';
import { SmartTableDatepickerComponentTime } from 'src/app/components/smart-table-datepicker-time/smart-table-datepicker-time.component';
import { SmartTableDatepickerComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { SmatTablePickerDatetimeComponent } from 'src/app/components/smat-table-picker-datetime/smat-table-picker-datetime.component';
import { getSettigs } from 'src/app/interfaces/promociones/tabla-horarios.interface';
import { FormulariosSesionesvirtualesService } from 'src/app/services/http-service/promociones/formulario-sesionesvirtuales/formularios-sesionesvirtuales.service';
import { ProgramacionService } from 'src/app/services/http-service/promociones/programacion/programacion.service';
import { MessagesService } from 'src/app/services/messages/messages.service';

@Component({
  selector: 'app-horarios-sesiones-virtuales',
  templateUrl: './horarios-sesiones-virtuales.component.html',
  styleUrls: ['./horarios-sesiones-virtuales.component.css']
})
export class HorariosSesionesVirtualesComponent implements OnInit {
  pipe = new DatePipe('en-US'); // Use your own locale
  programas: any = [];
  programasSelect: any = [];
  registros: any;
  settings: any = {
    actions: {
      columnTitle: 'Opciones',
      width: '2%',
      add: true,
      edit: true,
      delete: true,
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
      perPage: 10,
    },
    columns: {
      id_programacion: {
        title: 'ID',
        type: 'string',
        width: '8%',
        editable: false,
        addable: false,
        filter: false
      },
      nombre_plan_estudio: {
        title: 'Plan de estudios',
        type: 'html',
        editor: {
          type: 'custom',
          component: InputprogramasComponent,
        },
        width: '20%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos los programas',
            list: [],
          },
        },
      },
      fecha_programada: {
        title: 'Fecha del evento',
        type: 'string',
        width: '15%',
        filter: true,
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
          config: {
            placeholder: 'End Time'
          }
        },
      },
      hora: {
        title: 'Hora del evento',
        type: 'html',
        width: '10%',
        filter: true,
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponentTime,
          config: {
            placeholder: 'End Time'
          }
        }
      },
      fecha_caducidad_registro: {
        title: 'Fecha de caducidad',
        type: 'string',
        width: '15%',
        filter: true,
        editor: {
          type: 'custom',
          component: SmatTablePickerDatetimeComponent,
          config: {
            placeholder: 'End Time'
          }
        },
      },
      maximo_asistentes: {
        title: 'Máximo de asistentes',
        type: 'string',
        width: '10%',
        editor: {
          type: 'custom',
          component: NumberComponentDynamicComponent,
        }
      },
      url_sesion: {
        title: 'Url enlace a sesión',
        type: 'string',
        width: '15%',
      },
      url_calendario: {
        title: 'Url agregar a calendario',
        type: 'string',
        width: '15%',
      },
      estatus: {
        title: 'Estatus',
        type: 'html',
        editor: {
          type: 'custom',
          component: EstatusSelectComponent,
        },
        width: '10%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [{ value: 'Activo', title: 'Activos' }, { value: 'Desactivado', title: 'Desactivados' }],
          },
        },
      }
    }
  }

  constructor(
    private programacionHTTP: ProgramacionService,
    private formulariosHTTP: FormulariosSesionesvirtualesService,
    private MessagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.getLiteraturas();
  }

  getLiteraturas() {
    this.MessagesService.showLoading();

    this.programas =  JSON.parse(localStorage.getItem('programas-formularios'));

    this.settings.columns.nombre_plan_estudio.filter.config.list = this.programas;
    this.settings = Object.assign({}, this.settings)

    this.programacionHTTP.getProgramacion().then(datas => {
      var res: any = datas;
      this.registros = res.resultado

      this.MessagesService.closeLoading();
    });
  }

  guardar_actualizar(ev) {
    if (ev.newData.maximo_asistentes == 0) {
      this.MessagesService.showSuccessDialog(
        "Todos los parámetros son requeridos",
        'error'
      );
      ev.confirm.reject();
      return;
    }

    if (ev.newData.maximo_asistentes > 900) {
      this.MessagesService.showSuccessDialog(
        "El limite máximo no puede ser mayor a 900",
        'error'
      );
      ev.confirm.reject();
      return;
    }

    if (ev.newData.id_programacion == 0 || !ev.newData.id_programacion) {
      ev.newData.id_programacion = 0;
    }

    ev.newData.id_usuario = sessionStorage.getItem('id');
    for (let datos of this.programas) {
      if (ev.newData.nombre_plan_estudio == datos.title) {
        ev.newData.id_plan_estudio = datos.id
      }
    }

    ev.newData.fecha_programada_f = this.newUYDate(ev.newData.fecha_programada);
    ev.newData.fecha_caducidad_registro_f = this.newUYDate(ev.newData.fecha_caducidad_registro);
    
    this.MessagesService.showLoading();
    this.programacionHTTP.setProgramacion(ev.newData).then(datas => {
      var res: any = datas;
      res = res.resultado[0];
      this.MessagesService.closeLoading();

      if (res.success == 1) {
        ev.newData.id_programacion = res.id;
        ev.confirm.resolve(ev.newData);

        this.MessagesService.showSuccessDialog(
          res.message,
          'success'
        );
      } else {
        this.MessagesService.showSuccessDialog(
          res.message,
          'error'
        );
      }
    });
  }

  eliminar(ev) {
    this.MessagesService.showLoading();
    ev.data.id_usuario = sessionStorage.getItem('id');
    this.programacionHTTP.delProgramacion(ev.data).then(datas => {
      var res: any = datas;
      res = res.resultado[0];
      this.MessagesService.closeLoading();

      if (res.success == 1) {
        ev.confirm.resolve(ev.data);

        this.MessagesService.showSuccessDialog(
          res.message,
          'success'
        );
      } else {
        this.MessagesService.showSuccessDialog(
          res.message,
          'error'
        );
      }
    });
  }

  newUYDate(pDate) {
    let dd = pDate.split("/")[0].padStart(2, "0");
    let mm = pDate.split("/")[1].padStart(2, "0");
    let yyyy = pDate.split("/")[2].split(" ")[0];

    if (mm.length == 1) {
      mm = '0' + mm;
    }

    if (pDate.split(" ")[1]) {
      let horas: any = pDate.split(" ")[1] + ':00';
      horas = horas.split(":");
      return yyyy + '-' + mm + '-' + dd + ' ' + horas[0] + ':' + horas[1] + ':' + horas[2];
    } else {
      return yyyy + '-' + mm + '-' + dd;
    }
  }
}
