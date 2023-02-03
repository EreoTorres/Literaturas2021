import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { ExpedienteDigitalService } from 'src/app/services/http-service/consejeria-estudiantil/expediente-digital/expediente-digital.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-expediente-digital',
  templateUrl: './expediente-digital.component.html',
  styleUrls: ['../citas/citas.component.css']
})
export class ExpedienteDigitalComponent implements OnInit {
  formAlumnos: UntypedFormGroup
  registros: LocalDataSource = new LocalDataSource()
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
      perPage: 20,
    },
    columns: {
      idmoodle: {
        title: 'ID de Moodle',
        type: 'string',
        width: '10%'
      },
      usuario: {
        title: 'Usuario',
        type: 'string',
        width: '15%'
      },
      numero_empleado: {
        title: 'Número de empleado',
        type: 'string',
        width: '15%'
      },
      nombre_completo: {
        title: 'Nombre completo',
        type: 'string',
        width: '30%'
      },
      estatus: {
        title: 'Estatus',
        type: 'html',
        width: '20%',
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: [
              {
                value: 'ACTIVO',
                title: 'ACTIVO'
              },
              {
                value: 'SUSPENDIDOS POR INACTIVIDAD',
                title: 'SUSPENDIDOS POR INACTIVIDAD'
              }
            ]
          }
        }
      }
    }
  }

  constructor(
    private ExpedienteDigitalHTTP: ExpedienteDigitalService,
    private messagesService: MessagesService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.formAlumnos = this.formBuilder.group({
      id_plan_estudio: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getAlumnos()
  }

  getAlumnos() {
    this.messagesService.showLoading();
    this.ExpedienteDigitalHTTP.generico('getAlumnos', {id_plan_estudio: 22}).then(datas => {
      var res: any = datas;
      this.registros = res.resultado
      this.messagesService.closeLoading();
    });
  }

}
