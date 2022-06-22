import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LiteraturasService } from './services/http-service/academica/literaturas/literaturas.service';
import { FormulariosSesionesvirtualesService } from './services/http-service/promociones/formulario-sesionesvirtuales/formularios-sesionesvirtuales.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AG Administrator 2021';

  constructor(
    private literaturasHTTP: LiteraturasService,
    private formulariosHTTP: FormulariosSesionesvirtualesService,
    public router: Router
  ) {
    this.getProgramasAcademicos()
  }

  getProgramasAcademicos(){
    this.literaturasHTTP.getProgramasAcademicos().then(datas => {
      var res: any = datas;
      
      localStorage.setItem("programas",JSON.stringify(res.resultado));
    });

    this.formulariosHTTP.getFormularios().then(datas => {
      var res: any = datas;
      var registrosForms = res.resultado
      var programas = [];

      for (let datos of registrosForms) {
        programas.push({ value: datos.nombre_plan_estudio, title: datos.nombre_plan_estudio, id: datos.id_plan_estudio });
      }

      localStorage.setItem("programas-formularios",JSON.stringify(programas));
    });

    this.literaturasHTTP.getCorporaciones().then(datas => {
      var res: any = datas;
      localStorage.setItem("corporaciones",JSON.stringify(res.resultado));
    });
  }
}
