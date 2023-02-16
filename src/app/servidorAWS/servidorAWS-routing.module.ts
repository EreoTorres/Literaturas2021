import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ServidorAWSService } from '../services/http-service/servidorAWS/servidor-AWS.service';
import { RutasCursamientoComponent } from './rutas-cursamiento/rutas-cursamiento.component';
import { ServidorAWSComponent } from './servidorAWS.component';
//import { EncuestasComponent } from './encuestas/encuestas.component';
//import { EventosComponent } from './eventos/eventos.component';
//import { ExpedienteDigitalComponent } from './expediente-digital/expediente-digital.component';

const routes: Routes = [{
  path: '',
  component: ServidorAWSComponent,
  children: [
    {
      path: 'rutas-cursamiento',
      component: RutasCursamientoComponent,
      canActivate:[ServidorAWSService]
    },
    /*{
      path: 'encuestas',
      component: EncuestasComponent,
      canActivate:[ConsejeriaEstudiantilService]
    },
    {
      path: 'eventos',
      component: EventosComponent,
      canActivate:[ConsejeriaEstudiantilService]
    },
    {
      path: 'expediente-digital',
      component: ExpedienteDigitalComponent,
      canActivate:[ConsejeriaEstudiantilService]
    },*/
    {
      path: '',
      redirectTo: 'rutas-cursamiento',
      pathMatch: 'full',
      canActivate:[ServidorAWSService]
    }, // redirect to `first-component`
    {
      path: '**',
      redirectTo: 'rutas-cursamiento',
      canActivate:[ServidorAWSService],
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServidorAWSRoutingModule {
}
