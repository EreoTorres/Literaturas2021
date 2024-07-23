import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { EventosService } from 'src/app/services/http-service/consejeria-estudiantil/eventos/eventos.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import Editor from 'src/assets/ckeditor5-build-classic/build/ckeditor';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-formulario-eventos',
  templateUrl: './formulario-eventos.component.html',
  styleUrls: ['../../citas/citas.component.css']
})
export class FormularioEventosComponent implements OnInit {

  formEvento: UntypedFormGroup
  programas: any = []
  registros: LocalDataSource = new LocalDataSource()
  settings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'editar', title: '<i class="material-icons-outlined">edit</i>&nbsp;'}
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
      id: {
        hide: true
      },
      titulo: {
        title: 'Título',
        type: 'string',
        width: '50%'
      },
      nombre_plan_estudio: {
        title: 'Plan de estudio',
        type: 'string',
        width: '30%'
      },
      estatus: {
        title: 'Habilitado',
        type: 'html',
        width: '20%',
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
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
  }
  bandera: boolean = true
  public editor_cotenido = Editor
  @ViewChild('agregarEvento') agregarEvento: ElementRef;
  id_plan_estudio: any = 0;

  constructor(
    private eventosHTTP: EventosService,
    private modalService: NgbModal,
    private messagesService: MessagesService,
    private formBuilder: UntypedFormBuilder,
    private app: AppComponent
  ) {
    this.formEvento = this.formBuilder.group({
      id: [0, [Validators.required]],
      titulo: ['', [Validators.required]],
      plan_estudio: [null, [Validators.required]],
      contenido: ['', [Validators.required]],
      estatus: [null, [Validators.required]],
      connection: [null]
    });

    this.defaultFormEvento();
  }

  ngOnInit(): void {
    this.getProgramas()
    this.getEventos()
  }

  getProgramas() {
    this.eventosHTTP.generico('getProgramas', {tipo: 1}).then(datas => {
      var res: any = datas
      this.programas = res.resultado
    });
  }

  defaultFormEvento() {
    this.formEvento.controls['id'].setValue(0)
    this.formEvento.controls['titulo'].setValue('')
    this.formEvento.controls['plan_estudio'].setValue('')
    this.formEvento.controls['contenido'].setValue('')
    this.formEvento.controls['estatus'].setValue(1)
  }

  resetAll() {
    this.id_plan_estudio = 0
    this.formEvento.reset()
    this.defaultFormEvento()
  }

  getEventos() {
    this.messagesService.showLoading()
    this.eventosHTTP.generico('getEventos').then(datas => {
      var res: any = datas
      this.registros = res.resultado.dataDO.concat(res.resultado.dataAWS).sort((a, b) => {
        let fechaA: any = new Date(a.orden);
        let fechaB: any = new Date(b.orden);
        return fechaB - fechaA;
      });
      this.messagesService.closeLoading()
    });
  }

  openModal(modal: any, bandera: boolean) {
    (!bandera ? this.formEvento.controls['plan_estudio'].disable() : this.formEvento.controls['plan_estudio'].enable())
    this.bandera = bandera
    this.resetAll()
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    });
  }

  onSelectChangeConnection(event: Event) {
    this.formEvento.controls['connection'].setValue((this.formEvento.value.plan_estudio != 'TODOS' ? event.target['selectedOptions'][0].getAttribute('connection') : 0));
  }

  guardarEvento() {
    if(this.formEvento.valid) {
      let estatus = 0
      if(this.formEvento.value.estatus) estatus = 1
      this.formEvento.controls['estatus'].setValue(estatus)

      this.messagesService.showLoading()
      this.eventosHTTP.generico('updateEvento', this.formEvento.value).then(datas => {
        var res: any = datas

        if(res.codigo == 0) this.messagesService.showSuccessDialog(res.mensaje, 'error');
        else {
          let success = 0;
          let message = '';

          if(this.formEvento.value.plan_estudio == 'TODOS' || this.formEvento.value.connection == 0) {
            success = res.resultado.dataDO[0][0].success;
            message = res.resultado.dataDO[0][0].message;
          }

          if(this.formEvento.value.plan_estudio == 'TODOS' || this.formEvento.value.connection == 1) {
            success = success + res.resultado.dataAWS[0][0].success;
            message += res.resultado.dataAWS[0][0].message;
          }

          if((this.formEvento.value.plan_estudio == 'TODOS' && success < 2) || success == 0) this.messagesService.showSuccessDialog(message, 'warning');
          else {
            message = (this.formEvento.value.plan_estudio == 'TODOS' ? 'Eventos actualizados exitosamente.' : 'Evento actualizado exitosamente.');
            this.modalService.dismissAll()
            this.messagesService.showSuccessDialog(message).then((result) => {
              if(result.isConfirmed) {
                this.resetAll()
                this.getEventos()
              }
            });
          }
        }
      });
    }
    else this.messagesService.showSuccessDialog('Todos los campos son obligatorios.', 'error');
  }

  onCustom(ev) {
    if(ev.action == 'editar') {
      this.messagesService.showLoading()
      let data = {
        id: ev.data.id,
        connection: ev.data.connection
      }
      this.eventosHTTP.generico('getEvento', data).then(datas => {
        var res: any = datas
        if(res.codigo == 200) {
          this.messagesService.closeLoading()
          this.openModal(this.agregarEvento, false)
          this.formEvento.controls['id'].setValue(ev.data.id)
          this.formEvento.controls['titulo'].setValue(ev.data.titulo)
          this.id_plan_estudio = ev.data.id_plan_estudio
          this.formEvento.controls['plan_estudio'].setValue(ev.data.id_plan_estudio)
          this.formEvento.controls['connection'].setValue(ev.data.connection)
          this.formEvento.controls['contenido'].setValue(res.resultado[0]['contenido'])
          this.formEvento.controls['estatus'].setValue(res.resultado[0]['estatus'])
        }
        else this.messagesService.showSuccessDialog(res.mensaje, 'error')
      });
    }
  }

}
