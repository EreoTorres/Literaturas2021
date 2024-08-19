import { Component, OnInit } from '@angular/core';
import { EncuestaService } from 'src/app/services/http-service/academica/encuesta/encuesta.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { Chart, scales } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-promedio-encuesta-satisfaccion',
  templateUrl: './promedio-encuesta-satisfaccion.component.html',
  styleUrls: ['./promedio-encuesta-satisfaccion.component.css']
})

export class PromedioEncuestaSatisfaccionComponent implements OnInit {
  loading: boolean = false;

  options_grafica = {
    responsive: true,
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
  };

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
    'connection': 0
  }

  constructor(
    private EncuestaService: EncuestaService,
    private MessagesService: MessagesService,
    private app: AppComponent
  ) { }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.getPlanes();
  }

  getPlanes() {
    this.MessagesService.showLoading();
    this.EncuestaService.getPlanesPromedioEncuesta(this.infoGral).then(async datas => {
      var res: any = datas;
      if (res.codigo == 200) {
        this.planes = res.resultado.dataDO.concat(res.resultado.dataAWS);
        this.plan=this.planes[0];
        this.infoGral.id_plan_estudio = this.planes[0].id;
        this.infoGral.connection = this.planes[0].connection;
        await this.getPromedioMateriasEncuestas();
      }
      this.MessagesService.closeLoading();
    });

  }

  async cambiarPlan(plan: any){
    this.plan=plan;
    this.infoGral.id_plan_estudio = plan.id;
    this.infoGral.connection= plan.connection;
    this.data = [];
    this.MessagesService.showLoading();
    await this.getPromedioMateriasEncuestas();
    this.MessagesService.closeLoading();    
  }

  getPromedioMateriasEncuestas() {
    return new Promise((resolve, reject) => {
      this.EncuestaService.getPromedioMateriasEncuestas(this.infoGral).then(datas => {
        var res: any = datas;
        if (res.codigo == 200 && res.resultado[0].length > 0 ) {

          let materias = res.resultado[0];
          var labels = new Array();
          var datos = new Array();
          materias.forEach((element: any) => {
            labels.push(element.nombre_materia)
            datos.push(element.promedio)
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
      });
    })
  }

}