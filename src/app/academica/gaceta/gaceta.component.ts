import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { GacetaService } from 'src/app/services/http-service/academica/gaceta/gaceta.service';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { AcademicaComponent } from '../academica.component';

@Component({
  selector: 'app-gaceta',
  templateUrl: 'gaceta.component.html',
  styleUrls: ['../literaturas/literaturas.component.css']
})
export class GacetaComponent implements OnInit {
  @Input() registros: any;

  programas: any = [];
  files: File[] = [];
  libro: any = {
    id_libro: 0,
    titulo: '',
    archivo: '',
    descripcion: '',
    fecha_publicacion: '',
    id_plan_estudio: 0,
    ruta: '',
    estatus: 1
  }

  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'descarga', title: '<i class="material-icons-outlined">cloud_download</i>&nbsp;'},
        { name: 'eliminar', title: '&nbsp;<i class="material-icons-outlined">delete</i>' },
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
      titulo: {
        title: 'Título del libro',
        type: 'string',
        width: '20%'
      },
      nombre_plan_estudio: {
        title: 'Plan de estudio',
        type: 'string',
        width: '15%'
      },
      fecha_publicacion: {
        title: 'Fecha de publicación',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      },
      fecha_modificacion: {
        title: 'Fecha de modificación',
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
    private gacetaHTTP: GacetaService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
    private academica:AcademicaComponent
  ) { }

  ngOnInit(): void {
    this.getGaceta();
    this.programas = this.academica.getProgramasAcademicos();
  }

  getGaceta(){
    this.MessagesService.showLoading();
    this.gacetaHTTP.getLibros().then(datas => {
      var res: any = datas;
      this.registros = res.resultado
      this.MessagesService.closeLoading();
    });
  }

  openModal(docs){
    this.modalService.open(docs, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    });
  }

  cerrarModal(){
    this.files = [];
  }

  onSelect(event) {
    if(event.addedFiles.length == 1) this.files.push(event.addedFiles[0]);
    else this.MessagesService.showSuccessDialog("No es posible subir más de un archivo por libro.", 'error');
  }

  onRemove() {
    this.files = [];
  }

  guardar(modal, links) {
    if(!this.libro.titulo || !this.libro.fecha_publicacion || !this.libro.descripcion ||
      this.libro.id_plan_estudio == 0 || this.files.length == 0) {
      this.MessagesService.showSuccessDialog("Todos los campos son requeridos.", 'error');
      return;
    }

    modal.close('Save click');
    this.MessagesService.showLoading();

    this.gacetaHTTP.updateLibro(this.libro)
    .then(data => {
      return data['resultado'][0].id_libro;
    })
    .then(data => {
      const formData = new FormData();
      this.libro.id_libro = data;
      this.libro.credencial_id = 1;
      this.libro.ruta = 'gaceta/' + this.libro.id_libro;

      const blobOverrides = new Blob([JSON.stringify(this.libro)], {
        type: 'application/json',
      });

      formData.append('data', blobOverrides);
      formData.append('files', this.files[0]);

      return this.gacetaHTTP.uploadFile(formData)
    })
    .then(data => {
      this.libro.archivo = data['resultado'][0].nombre_anterior;
      this.libro.ruta = data['resultado'][0].nombre;
      return this.gacetaHTTP.updateLibro(this.libro);
    })
    .then (data => {
      this.MessagesService.closeLoading();
      if(data['resultado'][0].success) {
        this.MessagesService.showSuccessDialog(data['resultado'][0].message, 'success')
        .then(() => {
          this.getGaceta();
          this.modalService.dismissAll();
        });
      }
      else this.MessagesService.showSuccessDialog('Error al registrar libro.', 'error');
    })
    .catch(err => this.MessagesService.showSuccessDialog(err, 'error'))
  }

  onCustom(ev) {
    if(ev.action == 'descarga'){
      if(ev.data.ruta) {
        var url = 'http://literaturas-env.eba-mp2evwet.us-east-2.elasticbeanstalk.com/generico/files/downloadfile/1/' + ev.data.ruta;
        window.open(url, "_blank");
      }
      else this.MessagesService.showSuccessDialog('No se encontro archivo.', 'warning');
    }
    else {
      this.libro.id_libro = ev.data.id_libro;
      this.libro.estatus = 0;
      this.MessagesService.showConfirmDialog('¿Seguro que deseas eliminar el libro?', '').then((result) => {
        if(result.isConfirmed) {
          this.MessagesService.showLoading();
          this.gacetaHTTP.updateLibro(this.libro)
          .then(data => {
            this.MessagesService.closeLoading();
            if(data['codigo'] == 200) {
              this.MessagesService.showSuccessDialog(data['resultado'][0].message, 'success').then((result) => {
                if(result.isConfirmed) this.getGaceta();
              })
            }
            else this.MessagesService.showSuccessDialog('Ocurrio un error al eliminar libro.', 'error');
          });
        }
      });
    }
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = '';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
