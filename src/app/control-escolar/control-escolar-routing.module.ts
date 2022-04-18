import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ControlEscolarService } from '../services/http-service/control-escolar/control-escolar.service';
import { RelacionMateriasComponent } from './relacion-materias/relacion-materias.component';
import { ControlEscolarComponent } from './control-escolar.component';

const routes: Routes = [{
  path: '',
  component: ControlEscolarComponent,
  children: [
    {
      path: 'relacion-materias',
      component: RelacionMateriasComponent,
      canActivate:[ControlEscolarService]
    },
    { 
      path: '',   
      redirectTo: 'relacion-materias', 
      pathMatch: 'full',
      canActivate:[ControlEscolarService]
    }, // redirect to `first-component`
    { 
      path: '**', 
      redirectTo: 'relacion-materias', 
      canActivate:[ControlEscolarService],
    }, 
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlEscolarRoutingModule {
}
