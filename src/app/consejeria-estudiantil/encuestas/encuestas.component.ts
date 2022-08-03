import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { EncuestasService } from 'src/app/services/http-service/consejeria-estudiantil/encuestas/encuestas.service';
import { ConsejeriaEstudiantilComponent } from '../consejeria-estudiantil.component';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['../citas/citas.component.css']
})
export class EncuestasComponent implements OnInit {
  programas: any = []
  formBusqueda: FormGroup
  encuestas: any = []
  tipos_busqueda: any = [
    {
      id: 'idmoodle',
      nombre: 'ID de Moodle'
    },
    {
      id: 'numero_empleado',
      nombre: 'Número de empleado'
    }
  ]
  registros: LocalDataSource = new LocalDataSource()
  datos: any = {
    mostrar: false,
    alumnos: [],
    datos_origen: 0,
    datos_encontrados: 0,
    datos_faltantes: 0
  }
  banderaBusqueda: number = 0
  datosFinal: any = []
  encuesta: any = {
    id: 0,
    asignadas: []
  }
  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: false,
      edit: false,
      delete: false,
      position: 'right',
      custom: [
        { name: 'eliminar', title: '&nbsp;<i class="material-icons-outlined">delete</i>' },
      ]
    },
    attr: {
      class: 'table table-bordered responsive'
    },
    pager: {
      perPage: 10,
    },
    columns: {}
  }

  constructor(
    private encuestasHTTP: EncuestasService,
    private messagesService: MessagesService,
    private consejeria_estudiantil:ConsejeriaEstudiantilComponent,
    private formBuilder: FormBuilder
  ) {
    this.formBusqueda = this.formBuilder.group({
      id_plan_estudio: [null, [Validators.required]],
      tipo_busqueda: [null, [Validators.required]],
      datos: ['', [Validators.required]]
    });

    this.defaultFormBusqueda()
  }

  ngOnInit(): void {
    this.programas = this.consejeria_estudiantil.getProgramasAcademicos()
  }

  defaultFormBusqueda() {
    this.formBusqueda.controls['id_plan_estudio'].setValue('')
    this.formBusqueda.controls['tipo_busqueda'].setValue('')
    this.formBusqueda.controls['datos'].setValue('')
  }

  getEncuestas(info: any) {
    this.encuestasHTTP.getEncuestas(info).then(datas => {
      var res: any = datas
      this.encuestas = res.resultado
      
      if(this.encuestas) {
        for (let x = 0; x < this.encuestas.length; x++) {
          let encuesta = this.encuestas[x]
          this.settings.columns['encuesta_' + encuesta.id] = {
            title: encuesta.titulo,
            type: 'html',
            width: '12%'
          }
        }
  
        this.settings = Object.assign({}, this.settings)
      }
    })
  }

  buscarAlumnos() {
    this.inicializarBusqueda()
    if(this.formBusqueda.valid) {
      this.messagesService.showLoading()
      let length = this.formBusqueda.value.datos.length
      let valores = this.formBusqueda.value.datos.replace(/(\r\n|\n|\r)/gm, " ")
      let nuevo = ''
      for (let i = 0; i < length; i++) {
        let actual = valores[i]
        if(isNaN(actual) || actual == ' ') {
          (nuevo ? this.repetidos(nuevo) : '')
          nuevo = ''
        }
        else {
          nuevo = nuevo.concat(actual.toString())
        }
      }
      (nuevo != '' ? this.repetidos(nuevo) : '')

      this.getAlumnos()
    }
    else this.messagesService.showSuccessDialog('Todos los campos son obligatorios.', 'error')
  }

  repetidos(nuevo: any) {
    if(this.existe(this.datos.alumnos, nuevo) == 0) this.datos.alumnos.push(nuevo)
  }

  existe(data: any, valor: any) {
    let resultado = 0
    for (let e = 0; e < data.length; e++) {
      let elemento = data[e]
      if(elemento == valor) resultado = e
    }

    return resultado
  }

  async getAlumnos() {
    this.getEncuestas({id_plan_estudio: this.formBusqueda.value.id_plan_estudio})
    this.datosFinal = []
    if(this.banderaBusqueda == 0) this.datos.datos_origen = this.datos.alumnos.length
    for (let x = 0; x < this.datos.alumnos.length; x++) {
      let alumno = {
        id_plan_estudio: this.formBusqueda.value.id_plan_estudio,
        tipo_busqueda: this.formBusqueda.value.tipo_busqueda,
        alumno: this.datos.alumnos[x],
        id_alumno: 0
      }

      await this.getAlumno(alumno)
    }
    
    if(this.datosFinal.length > 0) {
      this.banderaBusqueda++
      this.registros.load(this.datosFinal)
      this.defaultBusqueda()
    }
    else this.messagesService.showSuccessDialog('Lo siento no se encontraron coincidencias, intenta de nuevo.', 'error')
  }

  getAlumno(alumno: any) {
    return new Promise(resolve => {
      this.encuestasHTTP.getAlumno(alumno)
      .then(data => {
        var res: any = data
        if(res.codigo == 200) {
          (this.banderaBusqueda == 0 ? this.datos.datos_encontrados++ : '')
          this.datosFinal.push(data['resultado'][0][0])
          resolve(true)
        }
        else {
          this.datos.datos_faltantes++
          resolve(true)
        }
      })
    })
  }

  inicializarBusqueda() {
    this.datos.mostrar = false
    this.datos.alumnos = []

    this.datos.datos_origen = 0
    this.datos.datos_encontrados = 0
    this.datos.datos_faltantes = 0
    
    this.inicializarBusqueda2()

    this.formBusqueda.controls['id_plan_estudio'].enable()
    this.formBusqueda.controls['tipo_busqueda'].enable()
    this.formBusqueda.controls['datos'].enable()

    this.banderaBusqueda = 0

    this.encuestas = []
    this.settings.columns = {
      idmoodle: {
        title: 'ID Moodle',
        type: 'string',
        width: '10%'
      },
      numero_empleado: {
        title: 'Número de empleado',
        type: 'string',
        width: '15%'
      },
      nombre: {
        title: 'Nombre',
        type: 'string',
        width: '15%'
      },
      apellidos: {
        title: 'Apellidos',
        type: 'string',
        width: '20%'
      },
      estatus: {
        title: 'Estatus',
        type: 'string',
        width: '15%'
      },
      tipo_descripcion: {
        title: 'Tipo alumno',
        type: 'string',
        width: '15%'
      }
    }
  }

  inicializarBusqueda2() {
    this.encuesta.id = ''
    this.encuesta.asignadas = []
  }

  defaultBusqueda() {
    this.formBusqueda.controls['id_plan_estudio'].disable()
    this.formBusqueda.controls['tipo_busqueda'].disable()
    this.formBusqueda.controls['datos'].disable()
    this.messagesService.closeLoading()
    this.datos.mostrar = true
  }

  onKeypressEvent(event: any) {
    if ((event.charCode < 48 || event.charCode > 57) && event.charCode != 32 && event.charCode != 13) return false
  }

  asignarEncuesta() {
    let asignacion = 0
    if(!this.registros) this.messagesService.showSuccessDialog('No es posible asignar encuesta, no se encontraron alumnos.', 'error')
    if(!this.encuesta.id) this.messagesService.showSuccessDialog('Selecciona una encuesta.', 'error')
    else {
      let data = this.registros['data']
      let txtAsignar = "<span class='estatus verde'>ASIGNAR</span>"
      for (let i = 0; i < data.length; i++) {
        let actual = data[i]['encuesta_' + this.encuesta.id]

        if(!actual || (actual.indexOf('ASIGNADA') == -1 && actual.indexOf('CONTESTADA') == -1)) {
          data[i]['encuesta_' + this.encuesta.id] = txtAsignar
          asignacion++
        }
      }
        
      if(this.encuesta.asignadas.indexOf(this.encuesta.id) == -1) {
        if(asignacion > 0) {
          this.encuesta.asignadas.push(this.encuesta.id)
          this.registros.load(data)
        }
        else this.messagesService.showSuccessDialog('No es posible aplicar la encuesta, todos los alumnos de la lista ya la tienen asignada.', 'warning')
      }
      else this.messagesService.showSuccessDialog('Encuesta ya seleccionada.', 'warning')
    }
  }

  async guardarCambios() {
    if(!this.encuesta.asignadas.length) this.messagesService.showSuccessDialog('No se encontraron encuestas para asignar.', 'error')
    else if(!this.registros['data'].length) this.messagesService.showSuccessDialog('La lista de alumnos está vacía, realiza otra búsqueda.', 'info')
    else {
      this.messagesService.showLoading()
      for (let x = 0; x < this.encuesta.asignadas.length; x++) {
        for (let i = 0; i < this.registros['data'].length; i++) {
          let info = {
            id_encuesta: this.encuesta.asignadas[x],
            id_alumno: this.registros['data'][i].id_alumno
          }

          await this.asignarEncuestaAlumno(info)
        }
      }

      this.messagesService.showSuccessDialog('Proceso de asignación de encuestas terminado.', 'success').then((result) => {
        if(result.isConfirmed) {
          this.inicializarBusqueda2()
          this.messagesService.showLoading()
          this.getAlumnos()
        }
      })
    }
  }

  asignarEncuestaAlumno(info: any) {
    return new Promise(resolve => {
      this.encuestasHTTP.asignarEncuestaAlumno(info)
      .then(data => {
        var res: any = data
        if(res.codigo == 200) resolve(true)
      })
    })
  }

  eliminarAlumno(dato_alumno: any) {
    let resultado = this.existe(this.datos.alumnos, dato_alumno)
    if(resultado > 0) this.datos.alumnos.splice(resultado, 1)
  }

  onCustom(ev: any) {
    if(ev.action == 'eliminar') {
      let numero_empleado = ev.data.numero_empleado
      for (let e = 0; e < this.registros['data'].length; e++) {
        let registro = this.registros['data'][e]
        if(registro.numero_empleado == numero_empleado) {
          this.registros['data'].splice(e, 1)
          this.registros.load(this.registros['data'])
          this.eliminarAlumno(numero_empleado)
          if(this.registros['data'].length == 0) this.salirAsignacion(2)
        }
      }
    }
  }

  salirAsignacion(tipo: number) {
    this.messagesService.showSuccessDialog(
      (tipo == 1
        ? '¿Está seguro de que desea salir de la asignación de encuestas?'
        :  'La lista de alumnos está vacía, realiza otra búsqueda.'
      ), 'info')
      .then((result) => {
      if(result.isConfirmed) {
        this.defaultFormBusqueda()
        this.inicializarBusqueda()
      }
    })
  }

}
