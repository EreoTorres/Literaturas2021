import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncuestaService } from 'src/app/services/http-service/academica/encuesta/encuesta.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChangeDetectorRef } from '@angular/core';
import { GlobalFunctionsService } from 'src/app/services/http-service/global-functions/global-functions.service';

@Component({
  selector: 'app-reporte-encuesta-satisfaccion',
  templateUrl: './reporte-encuesta-satisfaccion.component.html',
  styleUrls: ['./reporte-encuesta-satisfaccion.component.css']
})
export class ReporteEncuestaSatisfaccionComponent implements OnInit {

  loading: boolean = false;
  formulario: FormGroup | any;
  encuesta_inactiva!: any;
  meses!: any[];
  listado_meses: any[] = [];
  listado_anios: any[] = [];
  periodos: any[] = [];
  materias!: any[];
  planes!: any[];
  encuestas!: any[];
  selectedData: any;
  anio_select!: any;
  curso: number = 0;
  plan: number = 0;
  curso_info!: any;
  encuesta_info!: any;
  encuestas_completas: any = 0;
  encuestas_incompletas: any = 0;
  periodo: number = 0;
  encuesta_seleccionada: number = 0;
  encuestas_inactivas!: any[];
  totalRecords!: number;
  registros_pregunta: {
    id: any;
    pregunta: any;
    tipo: any;
    registro_respuestas: any;
    totales: any;
    datos: any;
    respuestas: any;
    pregunta_orden: any;
  }[] = [];

  settings = {
    actions: {
      columnTitle: 'Opciones',
      add: false,
      edit: false,
      delete: false,
      position: 'right'
    },
    attr: {
      class: 'table responsive table-striped table-hover table-sm'
    },
    pager: {
      perPage: 4,
    },
    columns: {
      numero_empleado: {
        title: 'Num. empleado.',
        type: 'string',
        filter: true,
      },
      alumno: {
        title: 'Alumno',
        type: 'string',
        filter: true,
      },
      respuesta: {
        title: 'Comentario',
        type: 'string',
        filter: true,
      },
    }
  };


  chartJs = Chart;
  chartLabelPlugin = ChartDataLabels;



  options_respuestas = {
    responsive: true,
    plugins: {


      datalabels: {
        formatter: (value: any, ctx: any) => {
          let sum = 0;
          const dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data: any) => {
            sum += data;
          });
          const percentage = (value * 100 / sum);
          return percentage !== 0 ? percentage.toFixed(1) + '%' : '';
        },
        color: 'black',
        font: {
          weight: 'bold',
          size: '10em',
        },
        display: 'auto'

      },
    },
  }

  options_respuestas_multi = {
    responsive: true,
    plugins: {


      datalabels: {
        formatter: (value: any, ctx: any) => {
          let sum = 0;
          const dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data: any) => {
            sum += data;
          });
          const percentage = (value * 100 / sum);
          return percentage !== 0 ? percentage.toFixed(1) + '%' : '';
        },
        color: 'black',
        font: {
          weight: 'bold',
          size: '10em',
        },
        display: 'auto'

      },
    },
  }

  infoGral =
    {
      'id_plan_estudio': 0,
      'materia': 0,
      'encuesta': '',
      'anio': 0,
      'mes': 0,
      'periodo': ''
    }

  constructor(
    private formBuilder: FormBuilder,
    private EncuestaService: EncuestaService,
    private MessagesService: MessagesService,
    private globalFunctions: GlobalFunctionsService
  ) {

    this.meses = [
      { 'mes': 'Enero', 'value': 1 },
      { 'mes': 'Febrero', 'value': 2 },
      { 'mes': 'Marzo', 'value': 3 },
      { 'mes': 'Abril', 'value': 4 },
      { 'mes': 'Mayo', 'value': 5 },
      { 'mes': 'Junio', 'value': 6 },
      { 'mes': 'Julio', 'value': 7 },
      { 'mes': 'Agosto', 'value': 8 },
      { 'mes': 'Septiembre', 'value': 9 },
      { 'mes': 'Octubre', 'value': 10 },
      { 'mes': 'Noviembre', 'value': 11 },
      { 'mes': 'Diciembre', 'value': 12 },
    ];

  }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.initForm();
    this.getPlanes();
  }

  initForm() {
    this.formulario = this.formBuilder.group({
      curso: [null],
      encuesta: [null],
      periodo: [null, Validators.required],
      mes: [null],
      anio: [null],
    });
  }

  //   ngAfterContentChecked(): void {
  //     this.cdr.detectChanges();
  //  }  

  getPlanes() {
    this.MessagesService.showLoading();
    this.EncuestaService.getPlanes(this.infoGral).then(async datas => {
      var res: any = datas;
      if (res.codigo == 200) {
        this.planes = res.resultado;
        this.plan=this.planes[0].id;
        this.infoGral.id_plan_estudio = this.planes[0].id;
        console.log(this.infoGral)
        await this.getMaterias();
      }
      this.MessagesService.closeLoading();
    });

  }
  async cambiarPlan(value: any){
    this.plan=value;
    this.infoGral.id_plan_estudio = value;
    this.curso = 0;
    this.periodo = 0;
    this.encuesta_seleccionada = 0;
    this.getEncuestasInactivas({'index':1});
    this.MessagesService.showLoading();
    await this.getMaterias();
    this.MessagesService.closeLoading();
    
  }

  getMaterias() {
    this.materias = [];
    return new Promise((resolve, reject) => {
      this.EncuestaService.getMaterias(this.infoGral).then(datas => {
        var res: any = datas;
        if (res.codigo == 200 && res.resultado.length > 0) {
          this.materias = res.resultado;
          resolve(true);
        }else{
          this.MessagesService.showSuccessDialog('No existen materias', 'error');
        }
      
      });
    })
 
  }


  getEncuestas(value: any) {
    this.curso = 0;
    this.periodo = 0;
    this.encuesta_seleccionada = 0;
    this.infoGral.materia = value;
    this.MessagesService.showLoading();
    this.registros_pregunta = [];
    this.formulario.reset();

    this.EncuestaService.getEncuestasMateriasActivas(this.infoGral).then(datas => {
      var res: any = datas;
      if (res.codigo == 200) {
        this.curso = value;
        this.encuestas = res.resultado;
      } else {
        this.MessagesService.showSuccessDialog('No existen encuestas', 'error');
      }
      this.MessagesService.closeLoading();
    });
  }

  getEncuestasInactivas(value: any) {
    this.formulario.reset();
    this.encuesta_inactiva = [];
    console.log(value);
    this.totalRecords = 0;
    if (value.index == 1) {
      this.curso = 0;
      this.periodo = 0;
      this.encuesta_seleccionada = 0;
      this.MessagesService.showLoading();

      this.EncuestaService.getEncuestasMateriasInactivas(this.infoGral).then(datas => {
        var res: any = datas;
        if (res.codigo == 200) {
          this.encuestas_inactivas = res.resultado;
          this.totalRecords = this.encuestas_inactivas.length;
        } else {
          this.MessagesService.showSuccessDialog('No existen encuestas', 'error');
        }
        this.MessagesService.closeLoading();
      });
    }
  }


  getPeriodos(value: any) {
    let datos: any = [];
    let anios: any = [];
    let mes: any = [];
    let mes_periodo: any = [];
    this.listado_anios = [];
    this.listado_meses = [];
    this.periodos = [];
    this.infoGral.encuesta = value;
    this.MessagesService.showLoading();

    this.EncuestaService.getEncuestasPeriodos(this.infoGral).then(datas => {
      var res: any = datas;
      if (res.codigo == 200 && res.resultado.length > 0) {
        datos = res.resultado;
        anios = [...new Set(datos.map((a: any) => a.anio))];
        anios.forEach((element: any) => {
          this.listado_anios.push({
            'anio': element,
            'value': element
          });
        });

        mes = datos.map((a: any) => a.mes);
        mes.forEach((element: number) => {

          if (element >= 1 && element <= 4 && !mes_periodo.find((periodo: any) => periodo == 1)) {
            mes_periodo.push(1);
            this.periodos.push({ 'periodo': 'Cuatrimestre 1 (Enero - Abril)', 'value': 1 });
          } else if (element >= 5 && element <= 8 && !mes_periodo.find((periodo: any) => periodo == 2)) {
            mes_periodo.push(2);
            this.periodos.push({ 'periodo': 'Cuatrimestre 2 (Mayo - Agosto)', 'value': 2 });
          } else if (element >= 9 && element <= 12 && !mes_periodo.find((periodo: any) => periodo == 3)) {
            mes_periodo.push(3);
            this.periodos.push({ 'periodo': 'Cuatrimestre 3 (Septiembre - Diciembre)', 'value': 3 });
          }

          this.listado_meses.push({
            'mes': this.meses[element - 1].mes,
            'value': this.meses[element - 1].value
          });
        });

        this.periodos.push(
          { 'periodo': 'Mensual', 'value': 4 },
          { 'periodo': 'Anual', 'value': 5 },
          { 'periodo': 'Acumulado', 'value': 6 },
        );
        this.MessagesService.closeLoading();
      } else {
        this.MessagesService.showSuccessDialog('No existen registros de respuestas', 'error');
      }
      
    });
  }

  getRespuestasEncuestas() {
    this.MessagesService.showLoading();

    return new Promise((resolve, reject) => {
      this.EncuestaService.getRespuestasEncuestas(this.infoGral).then(datas => {
        var res: any = datas;
        this.MessagesService.closeLoading();
        if (res.codigo == 200 && res.resultado[0].length > 0) {
          resolve(res)
        } else {
          this.MessagesService.showSuccessDialog('No existen registros', 'error');
        }
      });
    })
  }


  getTotalEncuestasRealizadas() {

    return new Promise((resolve, reject) => {
      this.EncuestaService.getTotalEncuestasRealizadas(this.infoGral).then(datas => {
        var res: any = datas;
        if (res.codigo == 200) {
          this.encuestas_completas = (res.resultado.completas[0].encuestas_completas) ? res.resultado.completas[0].encuestas_completas : 0;
          this.encuestas_incompletas = (res.resultado.incompletas[0].encuestas_incompletas) ? res.resultado.incompletas[0].encuestas_incompletas : 0;
        } else {
          this.MessagesService.showSuccessDialog('No existen registros', 'error');
        }
      });
    })
  }


  async getRespuestasEncuesta() {
    this.encuesta_inactiva = 0;
    this.registros_pregunta = [];
    let datos: any[] = [];


    let res: any = await this.getRespuestasEncuestas();
    datos = res.resultado[0];
    let preguntas: any[] = [];
    datos.forEach((dato: any) => {

      if (!preguntas.find((element: any) => element == dato.orden)) {
        const result = datos.filter((respuesta: any) => respuesta.orden == dato.orden);
        let respuestas = result.map((a: any) => a.respuesta);
        let totales_respuestas = result.map((a: any) => a.total);
        let respuesta_orden = {};
        preguntas.push(dato.orden);
        if (dato.tipo == 4) {
          let respuestas_tipo_4: any[] = [];
          respuestas.forEach((element: any) => {
            if (!respuestas_tipo_4.find((a: any) => a == element)) {
              respuestas_tipo_4.push(element);
            }
          });
          let total_orden_respuesta: any[] = [];
          respuestas_tipo_4.forEach((element: any, index) => {
            const res = result.filter((respuesta: any) => (respuesta.texto_orden == index + 1));
            let result_total = res.map((a: any) => a.total);
            let backgroundColor = ['#205db0', '#f7464a', '#f4d03f', '#cccccc', '#5eba7df7', '#689be3', '#b02096', '#5920b0', '#f77846', '#3f7852'];
            let hoverBackgroundColor = ['#205db0', '#f7464a', '#f4d03f', '#cccccc', '#5eba7df7', '#689be3', '#b02096', '#5920b0', '#f77846', '#3f7852'];
            total_orden_respuesta.push({
              label: index + 1,
              data: result_total,
              backgroundColor: backgroundColor[index],
              hoverBackgroundColor: hoverBackgroundColor[index],
            });
          });
          respuesta_orden = {
            labels: respuestas_tipo_4,
            datasets: total_orden_respuesta,
          }
        }

        this.registros_pregunta.push({
          id: dato.orden,
          pregunta: dato.pregunta.replace('<br>', ' '),
          tipo: dato.tipo,
          registro_respuestas: respuestas,
          totales: totales_respuestas,
          datos: result,
          respuestas: {
            labels: respuestas,
            datasets: [
              {
                data: totales_respuestas,
                backgroundColor: [
                  '#205db0', '#f7464a', '#f4d03f', '#cccccc', '#5eba7df7', '#689be3', '#b02096', '#5920b0', '#f77846', '#3f7852'
                ],
                hoverBackgroundColor: [
                  '#205db0', '#f7464a', '#f4d03f', '#cccccc', '#5eba7df7', '#689be3', '#b02096', '#5920b0', '#f77846', '#3f7852'
                ]
              }
            ]
          },
          pregunta_orden: respuesta_orden
        });
      }
    });

  }

  generarGraficas(value: any) {

    this.infoGral.encuesta = value.encuesta;
    this.infoGral.periodo = value.periodo;

    switch (value.periodo) {
      case 4:
        this.infoGral.mes = value.mes;
        this.infoGral.anio = value.anio;
        break;
      case 6:
        this.infoGral.mes = 0;
        this.infoGral.anio = 0;
        break;
      default:
        this.infoGral.mes = 0;
        this.infoGral.anio = value.anio;
        break;
    }

    let materia = this.materias.filter((res: any) => res.id == this.curso)
    this.curso_info = materia[0].nombre;
    this.encuesta_info = this.encuestas.filter((res: any) => res.id == this.encuesta_seleccionada);

    this.getTotalEncuestasRealizadas();
    this.getRespuestasEncuesta();
  }

  async getRegistrosExcel(value: any) {
    this.infoGral.encuesta = value.encuesta;
    this.infoGral.periodo = value.periodo;

    switch (value.periodo) {
      case 4:
        this.infoGral.mes = value.mes;
        this.infoGral.anio = value.anio;
        break;
      case 6:
        this.infoGral.mes = 0;
        this.infoGral.anio = 0;
        break;
      default:
        this.infoGral.mes = 0;
        this.infoGral.anio = value.anio;
        break;
    }


    let res: any = await this.getRespuestasEncuestas();
    let datos = res.resultado[0];
    this.exportToExcel(datos);
  }

  generarGraficaInactivos(value: any) {
    this.infoGral.encuesta = value;
    this.infoGral.periodo = '6';
    this.encuesta_info = this.encuestas_inactivas.filter((res: any) => res.id == value);
    this.curso_info = this.encuesta_info[0].nombre_materia;
    this.getTotalEncuestasRealizadas();
    this.getRespuestasEncuesta();
  }

  async getRegistrosExcelInactivos(value: any) {
    this.infoGral.periodo = '6';
    this.infoGral.encuesta = value;
    let res: any = await this.getRespuestasEncuestas();
    let datos = res.resultado[0];
    this.exportToExcel(datos);
  }

  exportToExcel(datos: any): void {

    const columnas: { name: any; filterButton: boolean; }[] = [];
    const registrosExcel: any[] = [];
    let nombre_columnas = [
      'Id', 'Número de empleado', 'Alumno', 'Plan de estudios', 'Número de pregunta', 'Pregunta', 'Respuesta', 'Total'
    ];
    nombre_columnas.forEach(colum => {
      columnas.push(
        {
          name: colum,
          filterButton: true
        }
      );
    });


    datos.forEach((registro: any) => {
      registro.pregunta = registro.pregunta.replace('<br>', ' ')
      let numero_empleado = (registro.tipo == 2) ? registro.numero_empleado : null;
      let respuesta = {
        'id': registro.id,
        'numero_empleado': numero_empleado,
        'alumno': registro.alumno,
        'plan_estudios': registro.nombre_plan,
        'numero_pregunta': registro.orden,
        'pregunta': registro.pregunta,
        'respuesta': registro.respuesta,
        'total': registro.total,
      }
      registrosExcel.push(Object.values(respuesta));
    });

    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet("Encuestas de satisfaccion");
    worksheet.addTable({
      name: 'MyTable',
      ref: 'A1',
      headerRow: true,
      style: {
        theme: 'TableStyleLight1',
        showRowStripes: true,
      },
      columns: columnas,
      rows: registrosExcel,
    });

    worksheet.columns.forEach(function (column, i) {
      worksheet.getColumn(i + 1).alignment = { wrapText: true };
      if (i == 5 || i == 6 || i == 9) {
        worksheet.getColumn(i + 1).width = 70;
      } else {
        worksheet.getColumn(i + 1).width = 20;
      }
    });

    //set downloadable file name
    let fname = "Reporte de encuestas de satisfaccion"
    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });


  }

}

