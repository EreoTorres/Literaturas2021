import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EncuestaService } from 'src/app/services/http-service/academica/encuesta/encuesta.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Console } from 'console';

@Component({
  selector: 'app-reporte-encuesta-satisfaccion',
  templateUrl: './reporte-encuesta-satisfaccion.component.html',
  styleUrls: ['./reporte-encuesta-satisfaccion.component.css']
})
export class ReporteEncuestaSatisfaccionComponent implements OnInit {

  formulario: UntypedFormGroup | any;
  chartImg: any[] = [];
  encuesta_inactiva!: any;
  meses!: any[];
  listado_meses: any[] = [];
  listado_anios: any[] = [];
  periodos: any[] = [];
  materias!: any[];
  planes!: any[];
  promedio_general :any = 0;
  encuestas!: any[];
  selectedData: any;
  anio_select!: any;
  curso: number = 0;
  plan: number = 0;
  ventana:number = 0;
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
    private formBuilder: UntypedFormBuilder,
    private EncuestaService: EncuestaService,
    private MessagesService: MessagesService,
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
 

  getPlanes() {
    this.MessagesService.showLoading();
    this.EncuestaService.getPlanes(this.infoGral).then(async datas => {
      var res: any = datas;
      if (res.codigo == 200) {
        this.planes = res.resultado;
        this.plan=this.planes[0].id;
        this.infoGral.id_plan_estudio = this.planes[0].id;
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
    this.registros_pregunta= [];
    this.encuestas_inactivas = [];
    this.formulario.reset();
    this.MessagesService.showLoading();
    (this.ventana == 0)? await this.getMaterias(): await this.getEncuestasInactivas({'index':1});
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

  async getEncuestasInactivas(value: any) {
    this.formulario.reset();
    this.encuesta_inactiva = [];
    this.ventana = value.index;
    this.totalRecords = 0;
    this.registros_pregunta= [];
    if (value.index == 1) {
      this.curso = 0;
      this.periodo = 0;
      this.encuesta_seleccionada = 0;
      this.MessagesService.showLoading();
      return new Promise((resolve, reject) => {
      this.EncuestaService.getEncuestasMateriasInactivas(this.infoGral).then(datas => {
        var res: any = datas;
        if (res.codigo == 200 && res.resultado.length > 0 ){
          this.encuestas_inactivas = res.resultado;
          this.totalRecords = this.encuestas_inactivas.length;
          this.MessagesService.closeLoading();
          resolve(true)    
        } else {
          this.MessagesService.showSuccessDialog('No existen encuestas inactivas', 'error');
        }
       
      });
    })
    }else{
      this.MessagesService.showLoading();
      await this.getMaterias();
      this.MessagesService.closeLoading();
      
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
    let promedio_preguntas = [];

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

        if(dato.tipo == 5 || dato.tipo == 6){
          let sum = 0;
          let prom : number = 0;
         for (let i = 0; i < respuestas.length; i++) {
          sum+= (respuestas[i]*totales_respuestas[i]);
         }
         let total=0;
         totales_respuestas.forEach(function(a){total += a;});
         prom = parseFloat((sum/total).toFixed(1));
         promedio_preguntas.push(prom);
        }

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

    let total_preguntas: number=0;
    for(let i of  promedio_preguntas) total_preguntas+=i;
    this.promedio_general=(total_preguntas/promedio_preguntas.length).toFixed(1)

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

  getRespuestasAlumnosEncuestas() {
    this.MessagesService.showLoading();

    return new Promise((resolve, reject) => {
      this.EncuestaService.getRespuestasAlumnosEncuestas(this.infoGral).then(datas => {
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

    let res: any = await this.getRespuestasAlumnosEncuestas();
    let datos = res.resultado[0];
    this.exportToExcel(datos,1);
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
    let res: any = await this.getRespuestasAlumnosEncuestas();
    let datos = res.resultado[0];
    this.exportToExcel(datos,0);
  }


  exportToExcel(datos: any, tipo: any): void {

    let registros = datos;
    const columnas: { name: any; filterButton: boolean; }[] = [];
    const registrosExcel: any[] = [];
    let nombre_columnas = Object.keys(registros[0]);

    nombre_columnas.forEach((colum :any) => {
      columnas.push(
        {
          name: (colum.replaceAll('_',' ')).toUpperCase(),
          filterButton: true
        }
      );
    });

    columnas.push(
      {
        name: 'ACUMULADO TOTAL',
        filterButton: false
      }
    );


    registros.forEach((registro: any) => {
      registro.fecha_asignacion =(registro.fecha_asignacion)?new Date(registro.fecha_asignacion).toLocaleString():"";
      registro.fecha_realizacion =(registro.fecha_realizacion)?new Date(registro.fecha_realizacion).toLocaleString():"";
      registro.fecha_inicio_curso =(registro.fecha_inicio_curso)?new Date(registro.fecha_inicio_curso).toLocaleDateString():"";
      registro.fecha_inscripcion =(registro.fecha_inscripcion)?new Date(registro.fecha_inscripcion).toLocaleDateString():"";
      registrosExcel.push(Object.values(registro));
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

    const endRow = worksheet.lastRow.number + 1;
    
      worksheet.getCell(`A${endRow}`).value = 'ACUMULADO POR PREGUNTA';
    
      worksheet.getCell(`Q${endRow}`).value = { formula: `ROUND(AVERAGE(Q2:Q${endRow-1}),1)`, date1904: false };
      worksheet.getCell(`S${endRow}`).value = { formula: `ROUND(AVERAGE(S2:S${endRow-1}),1)`, date1904: false };
      worksheet.getCell(`U${endRow}`).value = { formula: `ROUND(AVERAGE(U2:U${endRow-1}),1)`, date1904: false };
      worksheet.getCell(`W${endRow}`).value = { formula: `ROUND(AVERAGE(W2:W${endRow-1}),1)`, date1904: false };
      worksheet.getCell(`Y${endRow}`).value = { formula: `ROUND(AVERAGE(Y2:Y${endRow-1}),1)`, date1904: false };
      worksheet.getCell(`AA${endRow}`).value = { formula: `ROUND(AVERAGE(AA2:AA${endRow-1}),1)`, date1904: false };
      worksheet.getCell(`AC${endRow}`).value = { formula: `ROUND(AVERAGE(AC2:AC${endRow-1}),1)`, date1904: false };

      if(tipo == 1){
        worksheet.getCell(`AF${endRow}`).value = { formula: `ROUND(AVERAGE(Q${endRow},S${endRow},U${endRow},W${endRow},
          Y${endRow},AA${endRow},AC${endRow}),1)`, date1904: false };
      }
      if(tipo == 0){
        worksheet.getCell(`AE${endRow}`).value = { formula: `ROUND(AVERAGE(AE2:AE${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AG${endRow}`).value = { formula: `ROUND(AVERAGE(AG2:AG${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AI${endRow}`).value = { formula: `ROUND(AVERAGE(AI2:AI${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AK${endRow}`).value = { formula: `ROUND(AVERAGE(AK2:AK${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AM${endRow}`).value = { formula: `ROUND(AVERAGE(AM2:AM${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AO${endRow}`).value = { formula: `ROUND(AVERAGE(AO2:AO${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AQ${endRow}`).value = { formula: `ROUND(AVERAGE(AQ2:AQ${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AS${endRow}`).value = { formula: `ROUND(AVERAGE(AS2:AS${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AU${endRow}`).value = { formula: `ROUND(AVERAGE(AU2:AU${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AW${endRow}`).value = { formula: `ROUND(AVERAGE(AW2:AW${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`AY${endRow}`).value = { formula: `ROUND(AVERAGE(AY2:AY${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`BA${endRow}`).value = { formula: `ROUND(AVERAGE(BA2:BA${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`BC${endRow}`).value = { formula: `ROUND(AVERAGE(BC2:BC${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`BE${endRow}`).value = { formula: `ROUND(AVERAGE(BE2:BE${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`BG${endRow}`).value = { formula: `ROUND(AVERAGE(BG2:BG${endRow-1}),1)`, date1904: false };
        worksheet.getCell(`BH${endRow}`).value = { formula: `ROUND(AVERAGE(Q${endRow},S${endRow},U${endRow},W${endRow},
          Y${endRow},AA${endRow},AC${endRow},AE${endRow},AG${endRow},AI${endRow},AK${endRow}
          ,AM${endRow},AO${endRow},AQ${endRow},AS${endRow},AU${endRow},AW${endRow}
          ,AY${endRow},BA${endRow},BC${endRow},BE${endRow},BG${endRow}),1)`, date1904: false };

      }


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

