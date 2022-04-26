import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AcademicaSesionService } from '../services/sesions-validations/sesion/academica/academica-sesion.service';
import { AcademicaComponent } from './academica.component';
import { LiteraturasComponent } from './literaturas/literaturas.component';
import { VideosComponent } from './videos/videos.component';
import { GacetaComponent } from './gaceta/gaceta.component';

const routes: Routes = [{
  path: '',
  component: AcademicaComponent,
  children: [
    {
      path: 'literaturas',
      component: LiteraturasComponent,
      canActivate:[AcademicaSesionService]
    },
    {
      path: 'videos',
      component: VideosComponent,
      canActivate:[AcademicaSesionService]
    },
    {
      path: 'gaceta',
      component: GacetaComponent,
      canActivate:[AcademicaSesionService]
    },
    {
      path: '',
      redirectTo: 'literaturas',
      pathMatch: 'full',
      canActivate:[AcademicaSesionService]
    },
    {
      path: '**',
      redirectTo: 'literaturas',
      canActivate:[AcademicaSesionService]
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicaRoutingModule {
}
