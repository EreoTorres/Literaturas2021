import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BibliotecaVirtualService } from 'src/app/services/http-service/academica/biblioteca-virtual/biblioteca-virtual.service'; 
import { MessagesService } from 'src/app/services/messages/messages.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { GlobalFunctionsService } from 'src/app/services/http-service/global-functions/global-functions.service'; 

@Component({
  selector: 'app-biblioteca-virtual',
  templateUrl: './biblioteca-virtual.component.html',
  styleUrls: ['../literaturas/literaturas.component.css']
})
export class BibliotecaVirtualComponent implements OnInit {
  @Input() registros: any;
  files: File[] = [];

  lectura: any = {
    id: 0,
    titulo: '',
    archivo: '',
    ruta: '',
    estatus: 1,
    modulo: 'biblioteca_virtual'
  }

  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'descargar', title: '<i class="material-icons-outlined">cloud_download</i>&nbsp;' },
        { name: 'eliminar', title: '&nbsp;<i class="material-icons-outlined">delete</i>' },
        { name: 'copiar', title: '&nbsp;<i class="material-icons-outlined">copy</i>' },
        { name: 'visualizar', title: '&nbsp;<i class="material-icons-outlined">window</i>' },
        { name: 'copiar-visualizar', title: '&nbsp;<i class="material-icons-outlined">send</i>' }
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
        title: 'Título',
        type: 'string',
        width: '20%'
      },
      fecha_registro: {
        title: 'Fecha de registro',
        type: 'string',
        filter: true,
        width: '10%'
      }
    }
  };

  constructor(
    private bibliotecaVirtualHTTP: BibliotecaVirtualService,
    private modalService: NgbModal,
    private messagesService: MessagesService,
    private globalFunctions: GlobalFunctionsService
  ) { }

  ngOnInit(): void {
    this.getBibliotecaVirtual();
  }

  getBibliotecaVirtual() {
    this.messagesService.showLoading();
    this.bibliotecaVirtualHTTP.getLecturas()
    .then(datas => {
      var res: any = datas;
      this.registros = res.resultado
      this.messagesService.closeLoading();
    });
  }

  openModal(docs) {
    this.modalService.open(docs, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    });
  }

  cerrarModal() {
    this.files = [];
  }

  onSelect(event) {
    if(event.addedFiles.length == 1) this.files.push(event.addedFiles[0]);
    else this.messagesService.showSuccessDialog("No es posible subir más de un archivo por lectura.", 'error');
  }

  onRemove() {
    this.files = [];
  }

  guardar(modal) {
    if(!this.lectura.titulo || this.files.length == 0) {
      this.messagesService.showSuccessDialog("Todos los campos son requeridos.", 'error');
      return;
    }

    modal.close('Save click');
    this.globalFunctions.guardarArchivo(this.lectura, this.files)
    .then((result) => {
      if(result) this.getBibliotecaVirtual();
    });
  }

  onCustom(ev) {
    switch(ev.action) { 
      case 'descargar': {
        this.globalFunctions.descargarArchivo(ev.data.ruta);
        break;
      }
      case 'eliminar': {
        this.lectura.id = ev.data.id;
        this.lectura.estatus = 0;

        this.globalFunctions.eliminarArchivo(this.lectura)
        .then((result) => {
          if(result) this.getBibliotecaVirtual();
        });
        break;
      }
      case 'copiar': {
        let ruta = environment.urlProduccion + 'generico/files/getfile/1/' + ev.data.ruta;
        this.globalFunctions.obtenerRutaArchivo(ruta);
        break;
      }
      case 'visualizar': {
        let url = 'academica/visualizador/' + ev.data.id;
        window.open(url, "_blank");
        break;
      }
      case 'copiar-visualizar': {
        let url = document.location.origin + '/academica/visualizador/' + ev.data.id;
        this.globalFunctions.obtenerRutaArchivo(url);
        break;
      }
      default: {
        this.messagesService.showSuccessDialog("Opción no encontrada, intenta de nuevo.", 'error');
        break; 
      }
   }
  }

}
