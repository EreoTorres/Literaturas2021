import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'academica',
    loadChildren: () => import('./academica/academica.module')
      .then(m => m.AcademicaModule)
  },
  {
    path: 'promociones',
    loadChildren: () => import('./promociones/promociones.module')
      .then(m => m.PromocionesModule)
  },
  {
    path: 'control-escolar',
    loadChildren: () => import('./control-escolar/control-escolar.module')
      .then(m => m.ControlEscolarModule)
  },
  {
    path: 'consejeria-estudiantil',
    loadChildren: () => import('./consejeria-estudiantil/consejeria-estudiantil.module')
      .then(m => m.ConsejeriaEstudiantilModule)
  },
  {
    path: 'servidorAWS',
    loadChildren: () => import('./servidorAWS/servidorAWS.module')
      .then(m => m.ServidorAWSModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }, // redirect to `first-component`
  {
    path: '**',
    component: LoginComponent
  },
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
