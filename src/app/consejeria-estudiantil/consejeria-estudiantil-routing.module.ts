import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsejeriaEstudiantilService } from '../services/http-service/consejeria-estudiantil/consejeria-estudiantil.service';
import { CitasComponent } from './citas/citas.component';
import { ConsejeriaEstudiantilComponent } from './consejeria-estudiantil.component';

const routes: Routes = [{
  path: '',
  component: ConsejeriaEstudiantilComponent,
  children: [
    {
      path: 'citas',
      component: CitasComponent,
      canActivate:[ConsejeriaEstudiantilService]
    },
    {
      path: '',
      redirectTo: 'citas',
      pathMatch: 'full',
      canActivate:[ConsejeriaEstudiantilService]
    }, // redirect to `first-component`
    {
      path: '**',
      redirectTo: 'citas',
      canActivate:[ConsejeriaEstudiantilService],
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsejeriaEstudiantilRoutingModule {
}
