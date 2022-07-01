import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BibliotecaVirtualService } from 'src/app/services/http-service/academica/biblioteca-virtual/biblioteca-virtual.service'; 
import { MessagesService } from 'src/app/services/messages/messages.service';
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
  messageArchivos: string = '';
  message: string = 'Para agregar un archivo PDF suéltelo aquí o haga clic en el navegador';
  @ViewChild('subirLectura') subirLectura: ElementRef;

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
        { name: 'editar', title: '&nbsp;<i class="material-icons-outlined">edit</i>' },
        { name: 'eliminar', title: '&nbsp;<i class="material-icons-outlined">delete</i>' },
        { name: 'visualizar', title: '&nbsp;<i class="material-icons-outlined">book</i>' },
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

  openModal(modal, tipo) {
    this.resetFormulario();
    (tipo == 1
      ? this.messageArchivos = this.message
      : this.messageArchivos = 'Para actualizar el archivo PDF suéltelo aquí o haga clic en el navegador'
    )
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    });
  }

  onSelect(event) {
    if(event.addedFiles.length == 1) {
      if(event.addedFiles[0].type == 'application/pdf') this.files.push(event.addedFiles[0]);
      else this.messagesService.showSuccessDialog("Solo se pueden subir archivos PDF.", 'error'); 
    }
    else this.messagesService.showSuccessDialog("No es posible subir más de un archivo por lectura.", 'error');
  }

  onRemove() {
    this.files = [];
  }

  guardar(modal) {
    if(this.lectura.id == 0 && (!this.lectura.titulo || this.files.length == 0)) {
      this.messagesService.showSuccessDialog("Todos los campos son requeridos.", 'error');
      return;
    }
    else if(this.lectura.id > 0 && !this.lectura.titulo) {
      this.messagesService.showSuccessDialog("El campo título es requerido.", 'error');
      return;
    }

    modal.close('Save click');
    this.globalFunctions.actualizarArchivo(this.lectura, this.files)
    .then((result) => {
      if(result) this.getBibliotecaVirtual();
    });
  }

  resetFormulario() {
    this.lectura = {
      id: 0,
      titulo: '',
      archivo: '',
      ruta: '',
      estatus: 1,
      modulo: 'biblioteca_virtual'
    }

    this.files = [];
  }

  onCustom(ev) {
    switch(ev.action) {
      case 'editar': {
        this.openModal(this.subirLectura, 2);
        this.lectura.id = ev.data.id;
        this.lectura.titulo = ev.data.titulo;
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
