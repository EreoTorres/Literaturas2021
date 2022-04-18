import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray ,NgForm} from '@angular/forms';
import { EstatusSelectComponent } from 'src/app/components/estatus-select-component/estatus-select.component';
import { InputImagenComponent } from 'src/app/components/input-imagen/input-imagen.component';
import { NumberComponentDynamicComponent } from 'src/app/components/number-component-dynamic/number-component-dynamic.component';
import { SmartTableDatepickerComponentTime } from 'src/app/components/smart-table-datepicker-time/smart-table-datepicker-time.component';
import { SmartTableDatepickerComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { PublicidadService } from 'src/app/services/http-service/promociones/publicidad/publicidad.service';
import { MessagesService } from 'src/app/services/messages/messages.service';

@Component({
  selector: 'app-publicidad',
  templateUrl: './publicidad.component.html',
  styleUrls: ['./publicidad.component.css']
})
export class PublicidadComponent implements OnInit {
  imagen: File;
  registros: any;
  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: true,
      edit: true,
      delete: false
    },
    add:{
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
        width: '10%',
        editable:false,
        addable: false,
        filter: false
      },
      titulo: {
        title: 'Título',
        type: 'string',
        width: '25%',
        filter: true,
      },
      descripcion: {
        title: 'Descripción',
        type: 'string',
        width: '25%',
        filter: true,
      },
      nombre_archivo: {
        title: 'Imagen',
        type:'string',
        width: '25%',
        editor: {
          type: 'custom',
          component: InputImagenComponent,
        }
      },
      estatus: {
        title: 'Estatus',
        type: 'html',
        editor: {
          type: 'custom',
          component: EstatusSelectComponent,
        },
        width: '25%',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [{value: 'Activo', title: 'Activos'},{value: 'Desactivado', title: 'Desactivados'}],
          },
        },
      },
      fecha_modificacion: {
        title: 'Modificación',
        type: 'string',
        width: '15%',
        editable:false,
        addable: false,
        filter: true
      },
    }
  };

  constructor(
    private MessagesService: MessagesService,
    private publicidadHTTP: PublicidadService
  ) { }

  ngOnInit(): void {
    this.getBannerCertificaciones();
  }

  getBannerCertificaciones(){
    this.MessagesService.showLoading();

    this.publicidadHTTP.getHistorialBannerCertificaciones().then(datas => {
      var res: any = datas;
      this.registros = res.resultado   
      this.MessagesService.closeLoading();
    });
  }

  guardar(ev){
    console.log(ev)
    if (ev.newData.descripcion == '' || ev.newData.titulo == '') {
      this.MessagesService.showSuccessDialog('Todos los parametros son requeridos.','error');
      ev.confirm.reject();
      return;
    }

    if(ev.newData.nombre_archivo == '' && ev.newData.id == 0){
      this.MessagesService.showSuccessDialog('Todos los parametros son requeridos.','error');
      ev.confirm.reject();
      return;
    }

    if(!ev.newData.id){
      ev.newData.id = 0;
    }

    ev.newData.id_usuario = sessionStorage.getItem('id');
    ev.newData.base = localStorage.getItem('base');

    this.MessagesService.showLoading();

    this.publicidadHTTP.setPublicidad(ev.newData).then(datas => {
      var res: any = datas;
      res = res.resultado[0];      
      this.MessagesService.closeLoading();

      if(res.success == 1){
        ev.newData.id_programacion = res.id;
        ev.confirm.resolve(ev.newData);

        this.MessagesService.showSuccessDialog("Registro guardado correctamente",'success').then(() => {
          this.getBannerCertificaciones();
        });
        localStorage.removeItem('base');
      }else{
        this.MessagesService.showSuccessDialog("Problemas al guardar el registro",'error');
        ev.confirm.reject();
      }
    });
  }

  onFileChange(files: FileList) {
    this.imagen = files.item(0);
  }
}
