import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { VisualizadorService } from 'src/app/services/http-service/visualizador/visualizador.service';
import { environment } from 'src/environments/environment';

declare var visualizador_js: any;

@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.component.html',
  styleUrls: ['./visualizador.component.css']
})
export class VisualizadorComponent implements OnInit {

  id: any = 0;

  constructor(
    private rutaActiva: ActivatedRoute,
    private visualizadorHTTP: VisualizadorService,
    private messagesService: MessagesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.rutaActiva.snapshot.paramMap.get('id');
    this.getLectura();
  }

  getLectura() {
    this.messagesService.showLoading();
    this.visualizadorHTTP.getLectura({id: this.id})
    .then(response => {
      var data: any = response;
      if(data.codigo == 200) {
        let ruta_archivo = data.resultado['ruta'];
        if(ruta_archivo) {
          this.messagesService.closeLoading();
          let ruta_final = 'http://literaturas-env.eba-mp2evwet.us-east-2.elasticbeanstalk.com/generico/files/getfile/1/' + ruta_archivo;
          // let ruta_final = environment.urlProduccion + 'generico/files/getfile/1/' + ruta_archivo;
          console.log(ruta_final);
          new visualizador_js(ruta_final);
        }
        else {
          this.messagesService.showSuccessDialog('Ocurrio un error al obtener archivo.', 'error').then((result) => {
            if(result.isConfirmed) this.router.navigate(['biblioteca-virtual']);
          });
        }
      }
      else this.messagesService.showSuccessDialog(data.mensaje, 'error');
    });
  }

}
