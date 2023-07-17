import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AcademicaSesionService } from '../services/sesions-validations/sesion/academica/academica-sesion.service';
import { AcademicaComponent } from './academica.component';
import { LiteraturasComponent } from './literaturas/literaturas.component';
import { VideosComponent } from './videos/videos.component';
import { GacetaComponent } from './gaceta/gaceta.component';
import { BibliotecaVirtualComponent } from './biblioteca-virtual/biblioteca-virtual.component';
import { VisualizadorComponent } from '../visualizador/visualizador/visualizador.component';
import { CertificacionesComponent } from './certificaciones/certificaciones.component';
import { ReporteEncuestaSatisfaccionComponent } from './reporte-encuesta-satisfaccion/reporte-encuesta-satisfaccion.component';
import { PromedioMateriasComponent } from './promedio-materias/promedio-materias.component';
import { PromedioEncuestaSatisfaccionComponent } from './promedio-encuesta-satisfaccion/promedio-encuesta-satisfaccion.component';

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
      path: 'biblioteca-virtual',
      component: BibliotecaVirtualComponent,
      canActivate:[AcademicaSesionService]
    },
    {
      path: 'certificaciones',
      component: CertificacionesComponent,
      canActivate:[AcademicaSesionService]
    },
    {
      path: 'reporte-encuesta-satisfaccion',
      component: ReporteEncuestaSatisfaccionComponent,
      canActivate:[AcademicaSesionService]
    },
    {
      path: 'promedio-materias',
      component: PromedioMateriasComponent,
      canActivate:[AcademicaSesionService]
    },
    {
      path: 'promedio-encuestas',
      component: PromedioEncuestaSatisfaccionComponent,
      canActivate:[AcademicaSesionService]
    },
    {
      path: 'visualizador/:id',
      component: VisualizadorComponent,
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
