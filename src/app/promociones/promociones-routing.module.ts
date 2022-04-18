import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProgramacionesComponent } from './programaciones/programaciones.component';
import { PromocionesComponent } from './promociones.component';
import { PromocionesSesionService } from '../services/sesions-validations/sesion/promociones/promociones-sesion.service';
import { PublicidadComponent } from './publicidad/publicidad.component';

const routes: Routes = [{
  path: '',
  component: PromocionesComponent,
  children: [
    {
      path: 'programaciones',
      component: ProgramacionesComponent,
      canActivate:[PromocionesSesionService]
    },
    {
      path: 'publicidad',
      component: PublicidadComponent,
      canActivate:[PromocionesSesionService]
    },
    { 
      path: '',   
      redirectTo: 'programaciones', 
      pathMatch: 'full',
      canActivate:[PromocionesSesionService]
    }, // redirect to `first-component`
    { 
      path: '**', 
      redirectTo: 'programaciones', 
      canActivate:[PromocionesSesionService],
    }, 
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromocionesRoutingModule {
}
