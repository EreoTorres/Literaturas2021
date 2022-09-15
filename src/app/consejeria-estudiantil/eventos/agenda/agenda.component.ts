import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { EventosService } from 'src/app/services/http-service/consejeria-estudiantil/eventos/eventos.service';
import { SmartTableDatepickerComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { GlobalFunctionsService } from 'src/app/services/http-service/global-functions/global-functions.service';
import { InputprogramasCeComponent } from 'src/app/components/inputprogramas-ce/inputprogramas-ce.component';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['../../citas/citas.component.css']
})
export class AgendaComponent implements OnInit {
  
  registros: LocalDataSource = new LocalDataSource()
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
        title: 'ID',
        type: 'number',
        width: '5%',
        editable: false,
        addable: false,
        filter: false
      },
      nombre: {
        title: 'Nombre',
        type: 'string',
        width: '50%'
      },
      plan_estudio: {
        title: 'Plan de estudios',
        type: 'html',
        editor: {
          type: 'custom',
          component: InputprogramasCeComponent
        },
        width: '20%'
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
    private globalFunctions: GlobalFunctionsService
  ) { }

  ngOnInit(): void {
    this.getAgenda()
  }

  getAgenda() {
    this.messagesService.showLoading()
    this.eventosHTTP.generico('getAgenda').then(datas => {
      var res: any = datas
      this.registros = res.resultado

      this.messagesService.closeLoading()
    });
  }

  aguardar_actualizar(ev: any) {
    if(!ev.newData.id) {
      ev.newData.id = 0
      ev.newData.estatus = 1
    }
    else ev.newData.estatus = (ev.newData.estatus == 'Si' ? 1 : 0)

    if(!ev.newData.plan_estudio) ev.newData.plan_estudio = 'TODOS'

    if (!ev.newData.nombre) this.messagesService.showSuccessDialog('El campo nombre es obligatorio.', 'error')
    
    ev.newData.fecha = this.globalFunctions.newUYDate(ev.newData.fecha)
    
    this.messagesService.showLoading()
    this.eventosHTTP.generico('addAgenda', ev.newData).then(datas => {
      var res: any = datas
      if(res.codigo == 200) {
        if(res.resultado[0][0]['success'] == 1) {
          this.messagesService.showSuccessDialog(res.resultado[0][0]['message']).then((result) => {
            if(result.isConfirmed) {
              ev.confirm.resolve(ev.newData)
              this.getAgenda()
            }
          });
        }
        else this.messagesService.showSuccessDialog(res.resultado[0][0]['message'], 'error')
      }
      else this.messagesService.showSuccessDialog(res.mensaje, 'error')
    });
  }

}
