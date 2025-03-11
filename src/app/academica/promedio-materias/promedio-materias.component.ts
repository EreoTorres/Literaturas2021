import { Component, OnInit } from '@angular/core';
import { EncuestaService } from 'src/app/services/http-service/academica/encuesta/encuesta.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { Chart, scales } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AppComponent } from 'src/app/app.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { GlobalFunctionsService } from 'src/app/services/http-service/global-functions/global-functions.service';

@Component({
  selector: 'app-promedio-materias',
  templateUrl: './promedio-materias.component.html',
  styleUrls: ['./promedio-materias.component.css']
})

export class PromedioMateriasComponent implements OnInit {
  formReporte: UntypedFormGroup;
  loading: boolean = false;

  options_grafica = {
    responsive: false,
    indexAxis: 'y',
    plugins: {
      datalabels: {
        aling: 'end',
        anchor: 'end',
        borderRadius: 4,
        backgroundColor: 'teal',
        color: 'white',
        font: {
          weight: 'bold',
          size: '10em',
        }

      }
    },
    scales:{
      y: {
        ticks:{
          autoSkip: false,
          maxTicksLimit: 100,
          stepSize: 1
        }
      }
    }
  }

  chartJs = Chart;
  chartLabelPlugin = ChartDataLabels;

  planes!: any[];
  plan: number = 0;
  data: any = [];
  promedio: number = 0;

  infoGral =
  {
    'id_plan_estudio': 0,
    'materia': 0,
    'encuesta': '',
    'anio': 0,
    'mes': 0,
    'periodo': '',
    'connection': 0,
    'fecha_inicio': null,
    'fecha_fin': null
  }
  
  fecha_actual: any;
  constructor(
    private EncuestaService: EncuestaService,
    private MessagesService: MessagesService,
    private formBuilder: UntypedFormBuilder,
    private globalFunctions: GlobalFunctionsService,
    private app: AppComponent
  ) { 
   
    this.formReporte = this.formBuilder.group({
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]]
    });
    
  }

  
  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.getPlanes();
    this.fecha_actual = new Date();
    this.fecha_actual = this.fecha_actual.getFullYear() + '-' + (this.fecha_actual.getMonth() + 1) + '-' + this.fecha_actual.getDate();
  }

  getPlanes() {
    this.MessagesService.showLoading();
    this.EncuestaService.getPlanesPromedio(this.infoGral).then(async datas => {
      var res: any = datas;
      if (res.codigo == 200) {
        this.planes = res.resultado;
        this.plan = this.planes[0].id;
        this.infoGral.id_plan_estudio = this.planes[0].id;
        //await this.getPromedioMaterias();
      }
      this.MessagesService.closeLoading();
    });

  }

  async cambiarPlan(value: any){

    this.plan=value;
    this.infoGral.id_plan_estudio = value;
   /*  console.log(this.infoGral.id_plan_estudio);
    this.data = []; */
   /*  this.MessagesService.showLoading();
    await this.getPromedioMaterias();
    this.MessagesService.closeLoading();     */
  }

  cambiarGrafica(){

    this.getPromedioMaterias();
    
  }
  

  getPromedioMaterias() {
    if(this.formReporte.value.fecha_fin == "" || this.formReporte.value.inicio == ""){ 
      this.MessagesService.showToast('Agregar bien las fechas solicitadas', 'error');
    }
    else
    {
      this.infoGral.fecha_inicio = this.formReporte.value.fecha_inicio;
      this.infoGral.fecha_fin = this.formReporte.value.fecha_fin;
    }
    return new Promise((resolve, reject) => {
      //  console.log("ESTAS SON LAS FECHAS", this.infoGral.fecha_inicio, this.infoGral.fecha_fin );
        this.MessagesService.showLoading();
        this.infoGral.connection = this.app.obtenerConnection(this.infoGral.id_plan_estudio);
        this.EncuestaService.getPromedioMaterias(this.infoGral).then(datas => {
          var res: any = datas;
          this.infoGral.fecha_inicio = null;
          this.infoGral.fecha_fin = null;
          if (res.codigo == 200 && res.resultado[0].length > 0 ) {
  
            let materias = res.resultado[0];
            var labels = new Array();
            var datos = new Array();
            materias.forEach((element: any) => {
              labels.push(element.name)
              datos.push(element.value)
            });
  
            this.data = {
              labels: labels,
              datasets: [
                {
                  label: 'Promedio',
                  data: datos,
                  backgroundColor: [
                    '#205db0', '#f7464a', '#f4d03f', '#cccccc', '#5eba7df7', '#689be3'
                  ],
                  hoverBackgroundColor: [
                    '#205db0', '#f7464a', '#f4d03f', '#cccccc', '#5eba7df7', '#689be3'
                  ]
                }
              ]
            };
            this.promedio = 1;
            resolve(true);
          }else{     
            this.MessagesService.showSuccessDialog('No existen registros', 'error');
          }
          this.MessagesService.closeLoading(); 
          
        });
     /*  } */

    })
  }

  generarReporte() {
    this.MessagesService.showLoading();

      this.infoGral.fecha_inicio = this.formReporte.value.fecha_inicio;
      this.infoGral.fecha_fin = this.formReporte.value.fecha_fin;
      this.infoGral.connection = this.app.obtenerConnection(this.infoGral.id_plan_estudio);
      console.log(this.infoGral.id_plan_estudio);
      this.EncuestaService.getReportePromedioMaterias(this.infoGral).then(datas => {
      var res: any = datas;
      console.log('Esto traigo ', res.resultado[0]);
        this.MessagesService.closeLoading();
        if(res.resultado[0].length) this.globalFunctions.exportToExcel("Reporte de Promedios", res.resultado[0]);
        else this.MessagesService.showToast('Error al obtener reporte.', 'error');
      });
      
      this.infoGral.fecha_inicio = null;
      this.infoGral.fecha_fin = null;
  }

}