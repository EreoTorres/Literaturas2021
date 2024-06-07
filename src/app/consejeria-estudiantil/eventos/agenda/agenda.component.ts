import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { EventosService } from 'src/app/services/http-service/consejeria-estudiantil/eventos/eventos.service';
import { SmartTableDatepickerComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { GlobalFunctionsService } from 'src/app/services/http-service/global-functions/global-functions.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['../../citas/citas.component.css']
})
export class AgendaComponent implements OnInit {
  
  registros: LocalDataSource = new LocalDataSource()
  planes_estudio: any = []
  estatus: any = [
    {
      value: 'Si',
      title: 'Si'
    },
    {
      value: 'No',
      title: 'No'
    }
  ]
  settings = {
    actions: {
      columnTitle: 'Opciones',
      width: '2%',
      add: true,
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
      confirmDelete: true
    },
    attr: {
      class: 'table table-bordered responsive'
    },
    pager: {
      perPage: 10,
    },
    columns: {
      id: {
        hide: true
      },
      nombre: {
        title: 'Nombre',
        type: 'string',
        width: '50%'
      },
      id_plan_estudio: {        
        hide: true
      },
      plan_estudio: {
        title: 'Plan de estudios',
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
        },
        editor: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: ''
          }
        },
        editable: false
      },
      fecha: {
        title: 'Fecha',
        type: 'string',
        width: '15%',
        filter: true,
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      },
      estatus: {
        title: 'Habilitado',
        type: 'html',
        width: '20%',
        addable: false,
        editor: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: this.estatus
          }
        },
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: this.estatus
          }
        }
      }
    }
  }

  constructor(
    private eventosHTTP: EventosService,
    private messagesService: MessagesService,
    private globalFunctions: GlobalFunctionsService,
    private app: AppComponent
  ) { }

  ngOnInit(): void {
    this.getAgenda()
  }

  getAgenda() {
    this.messagesService.showLoading()

    this.eventosHTTP.generico('getPlanesEstudio', {tipo: 1}).then(datas => {
      var res: any = datas;
      this.settings.columns.plan_estudio.filter.config.list = res.resultado.filter(r => r.value != 'TODOS');
      this.settings.columns.plan_estudio.editor.config.list = res.resultado;
      this.settings = Object.assign({}, this.settings);
    });

    this.eventosHTTP.generico('getPlanesEstudio', {tipo: 2}).then(datas => {
      var res: any = datas;
      this.planes_estudio = res.resultado;
    });

    this.eventosHTTP.generico('getAgenda').then(datas => {
      var res: any = datas
      this.registros = res.resultado.dataDO.concat(res.resultado.dataAWS).sort((a, b) => {
        let fechaA: any = new Date(a.orden);
        let fechaB: any = new Date(b.orden);
        return fechaB - fechaA;
      });
      this.messagesService.closeLoading()
    });
  }

  guardar_actualizar(ev: any) {
    if(!ev.newData.id) {
      ev.newData.id = 0
      ev.newData.estatus = 1
      ev.newData.id_plan_estudio = this.planes_estudio.find(plan_estudio => plan_estudio.title == ev.newData.plan_estudio).value;
      ev.newData.connection = (ev.newData.id_plan_estudio != 'TODOS' ?  this.planes_estudio.find(plan_estudio => plan_estudio.title == ev.newData.plan_estudio).connection : 0);
    }
    else ev.newData.estatus = (ev.newData.estatus == 'Si' ? 1 : 0)

    if (ev.newData.nombre == "") this.messagesService.showSuccessDialog('El campo nombre es obligatorio.', 'error')
    else if (ev.newData.plan_estudio == "") this.messagesService.showSuccessDialog('El campo Plan de estudios es obligatorio.', 'error')
    else {
      ev.newData.fecha = this.globalFunctions.newUYDate(ev.newData.fecha)
      
      this.messagesService.showLoading();
      
      this.eventosHTTP.generico('addAgenda', ev.newData).then(datas => {
        var res: any = datas;
        if(res.codigo == 0) this.messagesService.showSuccessDialog(res.mensaje, 'error');
        else {
          let success = 0;
          let message = '';

          if(ev.newData.plan_estudio == 'TODOS' || [0,2].includes(ev.newData.connection)) {
            success = res.resultado.dataDO[0][0].success;
            message = res.resultado.dataDO[0][0].message;
          }

          if(ev.newData.plan_estudio == 'TODOS' || [1,2].includes(ev.newData.connection)) {
            success = success + res.resultado.dataAWS[0][0].success;
            message += res.resultado.dataAWS[0][0].message;
          }

          if((ev.newData.plan_estudio == 'TODOS' && success < 2) || success == 0) this.messagesService.showSuccessDialog(message, 'warning');
          else {
            message = (ev.newData.plan_estudio == 'TODOS' ? 'Eventos actualizados exitosamente.' : 'Evento actualizado exitosamente.');
            this.messagesService.showSuccessDialog(message).then((result) => {
              if(result.isConfirmed) {
                ev.confirm.resolve(ev.newData);
                this.getAgenda();
              }
            });
          }
        }
      });
    }
  }

}
