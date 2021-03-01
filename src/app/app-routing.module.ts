import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';
import { SesionService } from './services/sesion/sesion.service';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'panel', component: PanelComponent,canActivate:[SesionService] },
  { path: '',   redirectTo: '/login', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: LoginComponent }, 
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }