import { Component, OnInit } from '@angular/core';
import { EstatusSelectComponent } from 'src/app/components/estatus-select-component/estatus-select.component';
import { FormulariosSesionesvirtualesService } from 'src/app/services/http-service/promociones/formulario-sesionesvirtuales/formularios-sesionesvirtuales.service';
import { MessagesService } from 'src/app/services/messages/messages.service';

@Component({
  selector: 'app-formulario-sesiones-virtuales',
  templateUrl: './formulario-sesiones-virtuales.component.html',
  styleUrls: ['./formulario-sesiones-virtuales.component.css']
})
export class FormularioSesionesVirtualesComponent implements OnInit {
  programas: any = [];
  corporaciones: any = [];
  registros: any;
  settings: any = {
    actions: {
      columnTitle: 'Opciones',
      width: '2%',
      add: false,
      edit: true,
      delete: false,
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
        type: 'string',
        width: '8%',
        editable: false,
        addable: false,
        filter: false
      },
      nombre_plan_estudio: {
        title: 'Plan de estudios',
        type: 'html',
        width: '20%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos los programas',
            list: [],
          },
        },
        editable: false,
        addable: false,
      },
      corporacion: {
        title: 'Corporación',
        type: 'string',
        width: '20%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos los programas',
            list: [],
          },
        },
        editable: false,
        addable: false,
      },
      fecha_modificacion: {
        title: 'Fecha de modificación',
        type: 'string',
        width: '15%',
        filter: true,
        editable: false,
        addable: false,
      },
      estatus: {
        title: 'Estatus',
        type: 'html',
        editor: {
          type: 'custom',
          component: EstatusSelectComponent,
        },
        width: '15%',
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
    private formulariosHTTP: FormulariosSesionesvirtualesService,
    private MessagesService: MessagesService
  ) {
  }

  ngOnInit(): void {
    this.getFormularios();
  }

  getFormularios() {
    this.MessagesService.showLoading();
    this.formulariosHTTP.getFormularios().then(datas => {
      var res: any = datas;
      this.registros = res.resultado

      for (let datos of JSON.parse(localStorage.getItem('programas'))) {
        if (this.registros.find(programa => programa.nombre_plan_estudio == datos.nombre_corto)) {
          this.programas.push({ value: datos.nombre_corto, title: datos.nombre_corto, id: datos.id })
        }
      }

      for (let datos of JSON.parse(localStorage.getItem('corporaciones'))) {
        if (this.registros.find(programa => programa.corporacion == datos.corporacion)) {
          this.corporaciones.push({ value: datos.corporacion, title: datos.corporacion, id: datos.id_corporacion })
        }
      }

      this.settings.columns.nombre_plan_estudio.filter.config.list = this.programas;
      this.settings.columns.corporacion.filter.config.list = this.corporaciones;
      this.settings = Object.assign({}, this.settings)

      this.MessagesService.closeLoading();
    });
  }

  guardar_actualizar(ev) {
    if (ev.newData.id == 0 || !ev.newData.id) {
      ev.newData.id = 0;
    }

    ev.newData.id_usuario = sessionStorage.getItem('id');

    for (let datos of this.programas) {
      if (ev.newData.nombre_plan_estudio == datos.title) {
        ev.newData.id_plan_estudio = datos.id
      }
    }

    for (let datos of this.corporaciones) {
      if (ev.newData.corporacion == datos.title) {
        ev.newData.id_corporacion = datos.id
      }
    }

    this.MessagesService.showLoading();

    this.formulariosHTTP.setFormulario(ev.newData).then(datas => {
      var res: any = datas;
      res = res.resultado[0];
      this.MessagesService.closeLoading();

      if (res.success == 1) {
        ev.newData.id = res.id;
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
}
