import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CereporteService } from '../services/http-service/cereporte/cereporte.service';
import { CereporteComponent } from './cereporte.component';
import { ReporteComponent } from './reporte/reporte.component';


const routes: Routes = [
  {
    path: '',
    component: CereporteComponent,
    children: [ 
      {
        path: 'reporte',
        component: ReporteComponent,
        canActivate:[CereporteService]
      },
  ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CereporteRoutingModule { }
