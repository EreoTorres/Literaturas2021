import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { RutasCursamientoService } from 'src/app/services/http-service/servidorAWS/rutas-cursamiento/rutas-cursamiento.service';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { ServidorAWSComponent } from '../servidorAWS.component';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { InputImagenComponent } from 'src/app/components/input-imagen/input-imagen.component';


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
  grupos: any = [];
  tipoMaterias: any = [];
  listaMaterias: any = [];
  materiasSeleccionadas: any = [];
  materiasNoSeleccionadas: any = [];
  data_envia: any =[];
  list_periodos = [{'title':'Periodo 1','value':'Periodo 1'},{'title':'Periodo 2','value':'Periodo 2'},{'title':'Periodo 3','value':'Periodo 3'},{'title':'Periodo 4','value':'Periodo 4'},
              {'title':'Periodo 5','value':'Periodo 5'},{'title':'Periodo 6','value':'Periodo 6'},{'title':'Periodo 7','value':'Periodo 7'},{'title':'Periodo 8','value':'Periodo 8'},
              {'title':'Periodo 9','value':'Periodo 9'},{'title':'Periodo 10','value':'Periodo 10'},{'title':'Periodo 11','value':'Periodo 11'},{'title':'Periodo 12','value':'Periodo 12'}];
  list_filtro = [{'title':'Si','value':'Si'},{'title':'No','value':'No'}]; 
  list_filtro2 = [{'title':'Solo un foro', 'value':'Solo un foro'}, {'title':'Todos los foros', 'value':'Todos los foros'}];
  list_filtro3 = [{'title':'Solo una actividad', 'value':'Solo una actividad'}, {'title':'Todas las actividades', 'value':'Todas las actividades'}];
  messageArchivos: string = '';
  message: string = 'Para agregar una imagen suéltelo aquí o haga clic en el navegador';
  tipoOrd : any = "";
  tipoOrdB : any = "";
  @ViewChild('agregarMaterias') agregarMaterias: ElementRef;
  @ViewChild('ordenarMaterias') ordenarMateriasV: ElementRef;
  @ViewChild('configurarMaterias') ordenarMateriasC: ElementRef;
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
        { name: 'editar', title: '<i class="material-icons-outlined" title="Editar Ruta">edit</i>&nbsp;'},
        { name: 'registrar_en_escolar', title: '<i class="material-icons-outlined" title="Registrar En Escolar">playlist_add</i>&nbsp;'},
        { name: 'ordenar', title: '<i class="material-icons-outlined" title="Ordenar Materias Escolar">sort</i>&nbsp;'},
        { name: 'serializar', title: '<i class="material-icons-outlined" title="Serializar Materias Escolar">low_priority</i>&nbsp;'},
        { name: 'configurar', title: '<i class="material-icons-outlined" title="Configurar Materias Escolar">settings</i>&nbsp;'},
        { name: 'activar_escolar', title: '<i class="material-icons-outlined" title="Activar Ruta Escolar">check_circle</i>&nbsp;'},
        { name: 'regresar', title: '<i class="material-icons-outlined" title="Regresar Ruta a Edición">backspace</i>&nbsp;'}
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
        width: '15%'
      },
      requiere_vigencias_t: {
        title: 'Requiere Vigencias',
        type: 'string',
        width: '8%',
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: this.list_filtro
          },
        }
      },
      prueba_t: {
        title: 'Es de Prueba',
        type: 'string',
        width: '8%',
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: this.list_filtro
          },
        }
      },
      fecha_registro: {
        title: 'Fecha de creación',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      },
      fecha_registro_escolar: {
        title: 'Fecha de publicacion',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        },
      },
      estatus:{
        title: 'Estatus',
        type: 'html',
        width: '8%',
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
        width: '8%',
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

  settings_configurar = {
    actions: {
      columnTitle: '',
      add: false,
      edit: true,
      delete: false,
      position: 'right'
    },
    edit: {
      editButtonContent: '<i class="material-icons-outlined">edit</i>',
      saveButtonContent: '<i class="material-icons-outlined">save</i>',
      cancelButtonContent: '<i class="material-icons-outlined">close</i>',
      confirmSave: true
    },
    attr: {
      class: 'table table-bordered responsive'
    },
    pager: {
      perPage: 10,
    },
    columns: {
      nombre_periodo: {
        title: 'Periodo',
        type: 'string',
        width: '15%',
        editor: {
          type: 'list',
          config: {
            list: this.list_periodos
          },
        },
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: this.list_periodos
          },
        }
      },
      materia: {
        title: 'Nombre de la materia',
        type: 'string',
        width: '30%',
        editable: false
      },
      foros_obligatorio:{
        title: 'Foros Obligatorio',
        type: 'html',
        width: '10%',
        editor: {
          type: 'list',
          config: {
            list: this.list_filtro
          },
        },
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: this.list_filtro
          },
        }
      },
      solo_un_foro:{
        title: 'Cuantos Foros',
        type: 'html',
        width: '10%',
        editor: {
          type: 'list',
          config: {
            list: this.list_filtro2
          },
        },
        filter: {
          type: 'list',
          config: {
            selectText: ' ',
            list: this.list_filtro2
          },
        }
      },
        actividades_obligatorio:{
          title: 'Actividades Obligatorio',
          type: 'html',
          width: '10%',
          editor: {
            type: 'list',
            config: {
              list: this.list_filtro
            },
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'TODOS',
              list: this.list_filtro
            },
          }
      },
      solo_una_actividad:{
        title: 'Cuantos Actividades',
        type: 'html',
        width: '10%',
        editor: {
          type: 'list',
          config: {
            list: this.list_filtro3
          },
        },
        filter: {
          type: 'list',
          config: {
            selectText: ' ',
            list: this.list_filtro3
          },
        }
      },
      tipo:{
        title: 'Tipo',
        type: 'html',
        width: '10%',
        editor: {
          type: 'list',
          config: {
            list: this.tipoMaterias
          },
        },
        valuePrepareFunction: (cell) => {
          return this.nombre_tipo_materia(cell);
        },
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: this.tipoMaterias 
          },
        }
    },
      certificacion:{
        title: '¿Es certificación?',
        type: 'html',
        width: '10%',
        editor: {
          type: 'list',
          config: {
            list: this.list_filtro
          },
        },
        filter: {
          type: 'list',
          config: {
            selectText: 'TODOS',
            list: this.list_filtro
          },
        }
    },
    grupo_certificacion:{
      title: 'Grupo de la certificación',
      type: 'html',
      width: '10%',
      editor: {
        type: 'list',
        config: {
          list: this.grupos
        },
      },
      valuePrepareFunction: (cell) => {
        return this.nombre_grupo(cell);
      },
      filter: {
        type: 'list',
        config: {
          selectText: 'TODOS',
          list: this.grupos 
        },
      }
  },
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
      requiere_vigencias: [0, [Validators.required]],
      prueba: [0, [Validators.required]],
      imagen: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      url_informacion: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
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

  get m(){
    return this.formRutas.controls;
  }

  defaultFormRuta() {
    this.formRutas.controls['id'].setValue(0);
    this.formRutas.controls['plan_estudio'].setValue('');
    this.formRutas.controls['nombre_ruta'].setValue('');
    this.formRutas.controls['requiere_vigencias'].setValue(0);
    this.formRutas.controls['prueba'].setValue(0);
    this.formRutas.controls['imagen'].setValue('');
    this.formRutas.controls['url_informacion'].setValue('');
  }

  getRegistros() {
    this.MessagesService.showLoading();
    this.rutasHTTP.generico('getRutasCursamiento').then(datas => {
      var res: any = datas;
      this.registros = res.resultado
      this.MessagesService.closeLoading();
    });
  }

  getGrupos() {
    return new Promise((resolve, reject) => {
      this.grupos.splice(0, this.grupos.length);
      // this.MessagesService.showLoading();
      this.rutasHTTP.grupos().then(datas => {
        var res: any = datas;
        if(res.groups.length > 0){
          res.groups.forEach(element => {
            this.grupos.push({'title':element.name,'value':element.id});
          });
        }
        resolve(this.grupos);
        
        // this.MessagesService.closeLoading();
        
      });
    });
  }

  getTipoMateria() {
    return new Promise((resolve, reject) => {
      this.tipoMaterias.splice(0, this.tipoMaterias.length);
      this.rutasHTTP.generico('getTipoMateria').then(datas => {
        var res: any = datas;
        if(res.resultado.length > 0){
          this.tipoMaterias.push({'title':'Ninguno','value':'Ninguno'});
          res.resultado.forEach(element => {
            this.tipoMaterias.push({'title':element.nombre,'value':element.id});
          });
        }
        resolve(this.tipoMaterias);
      });
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
    this.formFinal.controls['responsable'].setValue(sessionStorage.getItem('id'));
    if (this.formFinal.valid) {
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

  getListaMateriasOrd(_enviar, _modal){
    this.rutasHTTP.generico('getMateriasOrd', _enviar).then(datas => {
      var res: any = datas;      
      this.listaMaterias = res.resultado;
      this.openModal(_modal);
      this.MessagesService.closeLoading();
    });
  }

  nombre_grupo(grupo :any ){
    if(grupo && grupo != 'Ninguno'){
    let nombre_grupo = this.grupos.filter((obj: any )=> obj.value == grupo);
    let grupo_filter = (nombre_grupo.length>0)?nombre_grupo[0].title:'Ninguno';
    return  grupo_filter;
    }
    else{
      return grupo;
    }
  }

  nombre_tipo_materia(tipo :any ){
    if(tipo && tipo != 'Ninguno'){
    let nombre_tipo_materia = this.tipoMaterias.filter((obj: any )=> obj.value == tipo);
    return nombre_tipo_materia[0].title;
    }
    else{
      return tipo;
    }
  }

  async onCustom(ev) {
    if(ev.action == 'editar') {
    
      if(ev.data.registro_escolar == 0){
        this.titulo_add = 'Editar Ruta de Cursamiento';
        this.nombre_boton_add = 'Actualizar';
        this.openModal(this.agregarNuevaRuta);
        this.formRutas.controls['id'].setValue(ev.data.id);
        this.formRutas.controls['plan_estudio'].setValue(ev.data.id_plan_estudio);
        this.formRutas.controls['nombre_ruta'].setValue(ev.data.nombre_ruta);
        this.formRutas.controls['requiere_vigencias'].setValue(ev.data.requiere_vigencias);
        this.formRutas.controls['prueba'].setValue(ev.data.prueba);
        this.formRutas.controls['url_informacion'].setValue(ev.data.url_informacion);
        this.formRutas.controls['imagen'].setValue(ev.data.imagen);
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
        this.getListaMateriasOrd(this.data_envia, this.ordenarMateriasV);
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
        this.getListaMateriasOrd(this.data_envia, this.ordenarMateriasV);
      } else {
        this.MessagesService.showSuccessDialog("La ruta de cursamiento requiere estar registrada en escolar para cambiar orden / seriación !!", 'error');
      }
    } else if (ev.action == 'configurar')
    {
      if(ev.data.registro_escolar == 1){
        this.MessagesService.showLoading();
        this.data_envia = {
          id: ev.data.id,
          tipo: 3,
          lista:[],
          responsable:sessionStorage.getItem('id')
        }
        await this.getGrupos();
        await this.getTipoMateria();
        this.getListaMateriasOrd(this.data_envia, this.ordenarMateriasC);
      } else {
        this.MessagesService.showSuccessDialog("La ruta de cursamiento requiere estar registrada en escolar para cambiar la configuración !!", 'error');
      }
    }
     else if (ev.action == 'activar_escolar')
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

  actualizar_materia(ev) {  
    if(ev.newData.certificacion == "Si" && ev.newData.grupo_certificacion == 'Ninguno'){
      this.MessagesService.showSuccessDialog('Selecciona un grupo para la materia marcada como certificación.','error');
    }
    else{
      this.MessagesService.showLoading();
        let enviar = {
          id_materia_escolar : ev.newData.id,
          periodo : ev.newData.nombre_periodo.replace("Periodo ",""),
          foros_obligatorio : (ev.newData.foros_obligatorio == "Si")? 1:0,
          solo_un_foro : (ev.newData.solo_un_foro == "Solo un foro")? 1:0,
          actividades_obligatorio : (ev.newData.actividades_obligatorio == "Si")? 1:0,
          solo_una_actividad : (ev.newData.solo_una_actividad == "Solo una actividad")? 1:0,
          certificacion : (ev.newData.certificacion == "Si")? 1:0,
          grupo_certificacion : (ev.newData.grupo_certificacion == 'Ninguno')?0: ev.newData.grupo_certificacion,
          tipo : (ev.newData.tipo == 'Ninguno')? 0:ev.newData.tipo
        }
        this.rutasHTTP.generico('actualizaMateria', enviar).then(datas => {
          var res: any = datas;
          
          res = res.resultado[0][0];
          this.MessagesService.closeLoading();
          if (res.success == 1) {
            ev.newData.periodo = enviar.periodo;
            ev.confirm.resolve(ev.newData);

            this.MessagesService.showSuccessDialog(
              res.message,
              'success'
            );
          } else {
            this.MessagesService.showSuccessDialog(
              res.message,
              'error'
            );
          }
        });
    }

  }

}
