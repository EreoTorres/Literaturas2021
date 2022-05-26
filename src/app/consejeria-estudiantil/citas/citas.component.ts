import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { CitasService } from 'src/app/services/http-service/consejeria-estudiantil/citas/citas.service';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { ConsejeriaEstudiantilComponent } from '../consejeria-estudiantil.component';

@Component({
  selector: 'app-citas',
  templateUrl: 'citas.component.html',
  styleUrls: ['citas.component.css']
})
export class CitasComponent implements OnInit {
  @Input() registros: any;

  programas: any = [];
  asignacion: any = {
    nombre: '',
    motivo: '',
    estatus: '',
    consejero: ''
  }

  settings = {
    actions: {
      columnTitle: 'Asignar | Estatus',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'asignar', title: '<i class="material-icons-outlined">person</i>&nbsp;'}
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
        width: '10%'
      },
      nombre_completo: {
        title: 'Nombre completo',
        type: 'string',
        width: '15%'
      },
      nombre_plan_estudio: {
        title: 'Plan de estudio',
        type: 'string',
        width: '15%'
      },
      motivo: {
        title: 'Motivo',
        type: 'string',
        width: '15%'
      },
      contacto: {
        title: 'Contacto',
        type: 'string',
        width: '10%'
      },
      horario: {
        title: 'Horario',
        type: 'string',
        width: '15%'
      },
      consejero: {
        title: 'Consejero',
        type: 'string',
        width: '15%'
      },
      estatus: {
        title: 'Estatus',
        type: 'html',
        width: '15%'
      },
      fecha_registro: {
        title: 'Fecha de registro',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      },
      fecha_asignacion: {
        title: 'Fecha de asignación',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      }
    }
  };

  constructor(
    private citasHTTP: CitasService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
    private academica:ConsejeriaEstudiantilComponent
  ) { }

  ngOnInit(): void {
    this.getCitas();
    // this.programas = this.academica.getProgramasAcademicos();
  }

  getCitas(){
    this.MessagesService.showLoading();
    this.citasHTTP.getCitas().then(datas => {
      var res: any = datas;
      console.log(datas);
      this.registros = res.resultado
      this.MessagesService.closeLoading();
    });
  }

  openModal(modal) {
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    });
  }

  // cerrarModal(){
  //   this.files = [];
  // }

  // onSelect(event) {
  //   if(event.addedFiles.length == 1) this.files.push(event.addedFiles[0]);
  //   else this.MessagesService.showSuccessDialog("No es posible subir más de un archivo por libro.", 'error');
  // }

  // onRemove() {
  //   this.files = [];
  // }

  onCustom(ev) {
    if(ev.action == 'asignar') {
      // alert("ASIGNARRRRRRRRRRRRRRRRR " + ev.data.id_cita);

      this.modalService.open('asignarEstatusConsejero', {
        backdrop: 'static',
        keyboard: false,
        size: 'xl'
      });
    }
  }

}
