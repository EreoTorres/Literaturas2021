import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { RutasCursamientoService } from 'src/app/services/http-service/servidorAWS/rutas-cursamiento/rutas-cursamiento.service';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { ServidorAWSComponent } from '../servidorAWS.component';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-rutas-cursamiento',
  templateUrl: 'rutas-cursamiento.component.html',
  styleUrls: ['rutas-cursamiento.component.css']
})
export class RutasCursamientoComponent implements OnInit {
  @Input() registros: any;
  //@Input() movimientos: any;
  @ViewChild('agregarNuevaRuta') agregarNuevaRuta: ElementRef;
  formRutas: FormGroup;
  formFinal: FormGroup;
  titulo_add: any = 'Agregar nueva Ruta de Cursamiento';
  nombre_boton_add: any = 'Guardar';
  programas: any = [];
  listaMaterias: any = [];
  materiasSeleccionadas: any = [];
  materiasNoSeleccionadas: any = [];
  data_envia: any =[];
  tipoOrd : any = "";
  tipoOrdB : any = "";
  @ViewChild('agregarMaterias') agregarMaterias: ElementRef;
  @ViewChild('ordenarMaterias') ordenarMateriasV: ElementRef;
  asignacion: any = {
    nombre: '',
    motivo: '',
    estatus: '',
    consejero: ''
  }
  settings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'editar', title: '<i class="material-icons-outlined">edit</i>&nbsp;'},
        { name: 'registrar_en_escolar', title: '<i class="material-icons-outlined">playlist_add</i>&nbsp;'},
        { name: 'ordenar', title: '<i class="material-icons-outlined">sort</i>&nbsp;'},
        { name: 'serializar', title: '<i class="material-icons-outlined">low_priority</i>&nbsp;'},
        { name: 'activar_escolar', title: '<i class="material-icons-outlined">check_circle</i>&nbsp;'},
        { name: 'regresar', title: '<i class="material-icons-outlined">backspace</i>&nbsp;'}
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
      plan_estudio: {
        title: 'Plan de Estudio',
        type: 'string',
        width: '15%'
      },
      nombre_ruta: {
        title: 'Nombre Ruta de Cursamiento',
        type: 'string',
        width: '20%'
      },
      fecha_registro: {
        title: 'Fecha de creación',
        type: 'string',
        filter: true,
        width: '12%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      },
      fecha_registro_escolar: {
        title: 'Fecha de publicacion',
        type: 'string',
        filter: true,
        width: '12%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        },
      },
      estatus:{
        title: 'Estatus',
        type: 'html',
        width: '10%',
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: [{'title':'Publicada','value':'Publicada'},{'title':'Oculta','value':'Oculta'}]
          },
        }
      },
      estatus_escolar:{
        title: 'Estatus Escolar',
        type: 'html',
        width: '10%',
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: [{'title':'Activa','value':'Activa'},{'title':'Inactiva','value':'Inactiva'}]
          },
        }
      }

    }
  };
  constructor(
    private rutasHTTP: RutasCursamientoService,
    private modalService: NgbModal,
    private MessagesService: MessagesService,
    private servidorAWS:ServidorAWSComponent,
    private formBuilder: FormBuilder
  ) {
    this.formRutas = this.formBuilder.group({
      id: [0, [Validators.required]],
      plan_estudio: [null, [Validators.required]],
      nombre_ruta: ['', [Validators.required]],
      responsable: [null]
    });

    this.defaultFormRuta();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listaMaterias, event.previousIndex, event.currentIndex);
  }
  
  ngOnInit(): void {
    this.programas = this.servidorAWS.getProgramasAcademicos();
    this.getRegistros();
  }


  defaultFormRuta() {
    this.formRutas.controls['id'].setValue(0);
    this.formRutas.controls['plan_estudio'].setValue('');
    this.formRutas.controls['nombre_ruta'].setValue('');
  }

  getRegistros() {
    this.MessagesService.showLoading();
    this.rutasHTTP.generico('getRutasCursamiento').then(datas => {
      var res: any = datas;
      this.registros = res.resultado
      this.MessagesService.closeLoading();
    });
  }

  /*validarEstatus(tipo: any) {
    if(tipo == 1) {
      if(this.formRutas.value.estatus == 3) {
        this.formRutas.controls['consejero'].disable()
        this.formRutas.controls['consejero'].setValue('')
      }
      else this.formRutas.controls['consejero'].enable()
    }
  }*/

  validarRuta(tipo: any) {
    this.formFinal = this.formRutas;
    //(tipo == 1 ? this.formFinal = this.formRutas : this.formFinal = this.formMaterias);
    this.formFinal.controls['responsable'].setValue(sessionStorage.getItem('id'));
    if (this.formFinal.valid) {
     /* let estatus = this.formFinal.value.estatus
      let consejero = this.formFinal.value.consejero
      if((estatus == 2 || estatus == 5) && !consejero) this.MessagesService.showSuccessDialog('Lo siento, para aplicar el estatus "' + (estatus = 2 ? 'Asignado' : 'Atendido') + '" se necesita seleccionar un consejero.', 'warning')
      else if(estatus == 7) {
        this.MessagesService.showConfirmDialog('¿Está seguro de que desea eliminar este registro?', '').then((result) => {
          if(result.isConfirmed) this.actualizarCita();
        });
      }
      else*/
       this.actualizarRuta();
    }
    else this.MessagesService.showSuccessDialog('Todos los campos son obligatorios.', 'error');
  }

  actualizarRuta() {
    this.MessagesService.showConfirmDialog('¿Está seguro de continuar con el registro?', '').then((result) => {
      if(result.isConfirmed) {
        this.MessagesService.showLoading();
        this.rutasHTTP.generico('actualizarRutasCursamiento', this.formFinal.value).then(datas => {
          var res: any = datas;
          if(res.codigo == 0) this.MessagesService.showSuccessDialog(res.mensaje, 'error');
          else {
            if(res.resultado[0][0].success == 1) {
              this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'success')
              .then(() => {
                this.modalService.dismissAll();
                this.getRegistros();
              });
            }
            else this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
          }
        });
      }
    });
    
  }

  resetAll() {
    this.formRutas.reset();
    this.defaultFormRuta();
  }

  openModal(modal) {
    this.resetAll();
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    });
  }

  seleccionar(listaSeleccionada){
    var sel = listaSeleccionada.map(o => o.value);
    var materiasListaAux = [];
    this.materiasNoSeleccionadas.forEach((currentValue, index) => {  
      if(sel.includes(currentValue.id))
      {
        this.materiasSeleccionadas.push(currentValue);
      } else {
        materiasListaAux.push(currentValue)
      }
    });
    this.materiasNoSeleccionadas = materiasListaAux;
    this.ordenarMaterias(this.materiasSeleccionadas);
  }

  seleccionarR(listaSeleccionada){
    var sel = listaSeleccionada.map(o => o.value);
    var materiasListaAux = [];
    this.materiasSeleccionadas.forEach((currentValue, index) => {  
      if(sel.includes(currentValue.id))
      {
        this.materiasNoSeleccionadas.push(currentValue);
      } else {
        materiasListaAux.push(currentValue)
      }
    });
    this.materiasSeleccionadas = materiasListaAux;
    this.ordenarMaterias(this.materiasNoSeleccionadas);
  }

  ordenarMaterias(lista)
  {
    lista.sort(function (a, b) {
      if (a.orden > b.orden) {
        return 1;
      }
      if (a.orden < b.orden) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  seleccionarTodo(chbTodos, matLista){
    if(chbTodos.checked){
      matLista.selectAll();
    } else {
      matLista.deselectAll();
    }

  }

  guardar(_registrar_escolar){
    this.MessagesService.showConfirmDialog('¿Está seguro de continuar con el registro?', '').then((result) => {
      if(result.isConfirmed) {
        let enviar = {
          id : this.data_envia.id,
          seleccionadas : this.materiasSeleccionadas.map(o => o.id),
          registrar_escolar : _registrar_escolar,
          responsable : sessionStorage.getItem('id')
        }
        this.MessagesService.showLoading();
        this.rutasHTTP.generico('guardarMateriasLista', enviar).then(datas => {
          var res: any = datas;
          if(res.codigo == 0) this.MessagesService.showSuccessDialog(res.mensaje, 'error');
          else {
            if(res.resultado[0][0].success == 1) {
              this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'success')
              .then(() => {
                this.modalService.dismissAll();
                this.getRegistros();
              });
            }
            else this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
          }
        });
      }
    });
  }

  guardarOrden(){
    this.MessagesService.showConfirmDialog('¿Está seguro de continuar con el registro?', '').then((result) => {
      if(result.isConfirmed) {
        this.listaMaterias.forEach((currentValue, index) => {
          this.data_envia.lista.push(currentValue.id);
        });
    
    
        this.MessagesService.showLoading();
        this.rutasHTTP.generico('guardarMateriasListaOrdenada', this.data_envia).then(datas => {
          var res: any = datas;
          if(res.codigo == 0) this.MessagesService.showSuccessDialog(res.mensaje, 'error');
          else {
            if(res.resultado[0][0].success == 1) {
              this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'success')
              .then(() => {
                this.modalService.dismissAll();
                this.getRegistros();
              });
            }
            else this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
          }
        });
      }
    });  
  }

  getListaMateriasOrd(enviar){
    this.rutasHTTP.generico('getMateriasOrd', enviar).then(datas => {
      var res: any = datas;
      this.listaMaterias = res.resultado;
      this.openModal(this.ordenarMateriasV);
      this.MessagesService.closeLoading();
    });
  }

  onCustom(ev) {
    if(ev.action == 'editar') {
    
      if(ev.data.registro_escolar == 0){
        this.titulo_add = 'Editar Ruta de Cursamiento';
        this.nombre_boton_add = 'Actualizar';
        this.openModal(this.agregarNuevaRuta);
        this.formRutas.controls['id'].setValue(ev.data.id);
        this.formRutas.controls['plan_estudio'].setValue(ev.data.id_plan_estudio);
        this.formRutas.controls['nombre_ruta'].setValue(ev.data.nombre_ruta);
      } else {
        this.MessagesService.showSuccessDialog("La ruta de cursamiento ya se encuentra registrada en escolar, no puede ser editada !!", 'error');
      }
    } else if(ev.action == 'registrar_en_escolar') {
      if(ev.data.registro_escolar == 0){
        this.MessagesService.showLoading();
        this.materiasSeleccionadas = [];
        this.materiasNoSeleccionadas = [];
        this.data_envia = {
          id: ev.data.id,
          seleccionadas : 1
        }
        this.rutasHTTP.generico('getMateriasLista', this.data_envia).then(datas => {
          var res: any = datas;
          this.materiasSeleccionadas = res.resultado[0];
        });
        this.data_envia.seleccionadas = 0;
        this.rutasHTTP.generico('getMateriasLista', this.data_envia).then(datas => {
          var res: any = datas;
          this.materiasNoSeleccionadas = res.resultado[0];
          this.openModal(this.agregarMaterias);
          this.MessagesService.closeLoading();
        });
      } else {
        this.MessagesService.showSuccessDialog("La ruta de cursamiento ya se encuentra registrada en escolar, no puede ser editada !!", 'error');
      }
    } else if (ev.action == 'ordenar'){
      if(ev.data.registro_escolar == 1){
        this.MessagesService.showLoading();
        this.tipoOrd = "Ordenar";
        this.tipoOrdB = "Orden";
        this.data_envia = {
          id: ev.data.id,
          tipo: 1,
          lista:[],
          responsable:sessionStorage.getItem('id')
        }
        this.getListaMateriasOrd(this.data_envia);
      } else {
        this.MessagesService.showSuccessDialog("La ruta de cursamiento requiere estar registrada en escolar para cambiar orden / seriación !!", 'error');
      }

    } else if (ev.action == 'serializar')
    {
      if(ev.data.registro_escolar == 1){
        this.MessagesService.showLoading();
        this.tipoOrd = "Serializar";
        this.tipoOrdB = "Serialización";
        this.data_envia = {
          id: ev.data.id,
          tipo: 2,
          lista:[],
          responsable:sessionStorage.getItem('id')
        }
        this.getListaMateriasOrd(this.data_envia);
      } else {
        this.MessagesService.showSuccessDialog("La ruta de cursamiento requiere estar registrada en escolar para cambiar orden / seriación !!", 'error');
      }
    } else if (ev.action == 'activar_escolar')
    {
      if(ev.data.activo_escolar == 0 && ev.data.registro_escolar == 1){
        this.MessagesService.showConfirmDialog('¿Está seguro de activar la ruta de cursamiento en escolar?', '').then((result) => {
          if(result.isConfirmed) {
            this.MessagesService.showLoading();
            let enviar = {
              id : ev.data.id,
              responsable :  sessionStorage.getItem('id')
            }
            this.rutasHTTP.generico('activarRutasCursamiento', enviar).then(datas => {
              var res: any = datas;
              if(res.codigo == 0) this.MessagesService.showSuccessDialog(res.mensaje, 'error');
              else {
                if(res.resultado[0][0].success == 1) {
                  this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'success')
                  .then(() => {
                    this.getRegistros();
                  });
                }
                else this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
              }
            });
          }
        });
      } else if (ev.data.activo_escolar == 1){
        this.MessagesService.showSuccessDialog("La ruta de cursamiento ya se encuentra activa en escolar!!", 'error');
      } else if (ev.data.registro_escolar == 0){
        this.MessagesService.showSuccessDialog("La ruta de cursamiento no se encuentra en escolar, no se puede activar !!", 'error');
      } else {
        this.MessagesService.showSuccessDialog("La ruta de cursamiento no se puede regresar a selección de materias !!", 'error');
      }
    } else if (ev.action == 'regresar')
    {
      if(ev.data.activo_escolar == 0 && ev.data.registro_escolar == 1){
        this.MessagesService.showConfirmDialog('¿Está seguro de regresar la ruta de cursamiento a selección de materias?', '').then((result) => {
          if(result.isConfirmed) {
            this.MessagesService.showLoading();
            let enviar = {
              id : ev.data.id,
              responsable :  sessionStorage.getItem('id')
            }
            this.rutasHTTP.generico('regresarRutasCursamiento', enviar).then(datas => {
              var res: any = datas;
              if(res.codigo == 0) this.MessagesService.showSuccessDialog(res.mensaje, 'error');
              else {
                if(res.resultado[0][0].success == 1) {
                  this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'success')
                  .then(() => {
                    this.getRegistros();
                  });
                }
                else this.MessagesService.showSuccessDialog(res.resultado[0][0].message, 'error');
              }
            });
          }
        });
      } else if (ev.data.activo_escolar == 1){
        this.MessagesService.showSuccessDialog("La ruta de cursamiento se encuentra activa en escolar, no se puede regresar a selección de materias !!", 'error');
      } else if (ev.data.registro_escolar == 0){
        this.MessagesService.showSuccessDialog("La ruta de cursamiento no se encuentra en escolar, no se puede regresar a selección de materias !!", 'error');
      } else {
        this.MessagesService.showSuccessDialog("La ruta de cursamiento no se puede regresar a selección de materias !!", 'error');
      }
    }
  }

}
