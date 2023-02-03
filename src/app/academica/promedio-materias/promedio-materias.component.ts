import { Component, OnInit } from '@angular/core';
import { EncuestaService } from 'src/app/services/http-service/academica/encuesta/encuesta.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-promedio-materias',
  templateUrl: './promedio-materias.component.html',
  styleUrls: ['./promedio-materias.component.css']
})
export class PromedioMateriasComponent implements OnInit {
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
    'periodo': ''
  }

  constructor(
    private EncuestaService: EncuestaService,
    private MessagesService: MessagesService,
  ) { }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.getPlanes();
  }

  getPlanes() {
    this.MessagesService.showLoading();
    this.EncuestaService.getPlanes(this.infoGral).then(async datas => {
      var res: any = datas;
      if (res.codigo == 200) {
        this.planes = res.resultado;
        this.plan=this.planes[0].id;
        this.infoGral.id_plan_estudio = this.planes[0].id;
        await this.getPromedioMaterias();
      }
      this.MessagesService.closeLoading();
    });

  }

  async cambiarPlan(value: any){
    this.plan=value;
    this.infoGral.id_plan_estudio = value;
    this.data = [];
    this.MessagesService.showLoading();
    await this.getPromedioMaterias();
    this.MessagesService.closeLoading();
    
  }


  getPromedioMaterias() {
    return new Promise((resolve, reject) => {
    this.EncuestaService.getPromedioMaterias(this.infoGral).then(datas => {
      var res: any = datas;
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
    });
  })

  }

}