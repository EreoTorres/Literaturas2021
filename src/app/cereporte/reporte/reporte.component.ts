import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { CereporteService } from 'src/app/services/http-service/cereporte/cereporte.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { SelectItem, PrimeNGConfig } from "primeng/api";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { of } from 'rxjs';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  formulario: FormGroup | any;
  planes!: any[];
  columnas: any[] = [];
  plan_estudios!: any;
  plan_info!: any;
  columnas_seleccionadas: any[] = [];
  columnas_filtros: any[] = [];
  filtro!: any;
  filtro_seleccionadas!: any;
  filtros_val: any[] = [];
  registros: any = [];
  totalRecords: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private CereporteService: CereporteService,
    private primengConfig: PrimeNGConfig,
    private modalService: NgbModal,
    private messagesService: MessagesService,
  ) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.initForm();
    this.getPlanes();

  }

  initForm() {
    this.formulario = this.formBuilder.group({
      plan_estudios: [null, Validators.required],
    });
  }

  getPlanes() {
    this.messagesService.showLoading();
    this.CereporteService.getPlanes().then(datas => {
      var res: any = datas;
      if (res.codigo == 200) {
        this.planes = res.resultado;
        this.plan_info = this.planes[0];
        this.plan_estudios = this.planes[0].id;
        this.getColumnas(this.planes[0].corporacion, this.planes[0].id);
      } else {
        this.messagesService.showSuccessDialog('No existen registros', 'warning');
      }
    });
  }

  getColumnas(corporacion: Number, plan: Number) {
    let info = {
      'corporacion': corporacion,
      'plan': plan
    };
    this.columnas = [];
    this.registros = [];
    this.CereporteService.getColumnas(info).then(datas => {
      var res: any = datas;
      if (res.codigo == 200) {
        this.columnas = res.resultado[0];
        this.messagesService.closeLoading();
      }
      else {
        this.messagesService.showSuccessDialog('No hay registros de columnas para el plan seleccionado.', 'warning');
      }
    });
  }
  cambiarPlan(value: any) {
    this.messagesService.showLoading();
    let plan = this.planes.filter(obj => obj.id == value);
    this.plan_info = plan;
    this.getColumnas(plan[0].corporacion, plan[0].id);
  }

  openModal(docs) {
    this.modalService.open(docs, {
      backdrop: 'static',
      keyboard: false,  // to prevent closing with Esc button (if you want this too)
      size: 'xl'
    });
  }

  agregar(value: any) {
    this.registros = [];
    if (value.filtro == 1) {
      this.columnas_filtros.push(value);
      this.columnas_filtros.sort((a, b) => a.orden - b.orden);
    }

    this.columnas_seleccionadas.push(value);
    this.columnas_seleccionadas.sort((a, b) => a.orden - b.orden);
    this.columnas = this.columnas.filter(obj => obj.columna !== value.columna);
    this.columnas.sort((a, b) => a.orden - b.orden);
  }

  eliminar(value: any) {
    this.registros = [];
    if (value.filtro == 1) {
      this.columnas_filtros = this.columnas_filtros.filter(obj => obj.columna !== value.columna);
      this.columnas_filtros.sort((a, b) => a.orden - b.orden);
      delete this.filtros_val[value.columna];
    }
    this.columnas_seleccionadas = this.columnas_seleccionadas.filter(obj => obj.columna !== value.columna);
    this.columnas_seleccionadas.sort((a, b) => a.orden - b.orden);
    this.columnas.push(value);
    this.columnas.sort((a, b) => a.orden - b.orden);
  }

  eliminarTodos() {
    this.registros = [];
    this.columnas_seleccionadas.forEach(element => {
      this.eliminar(element);
    });
  }
  seleccionarTodos() {
    this.registros = [];
    this.columnas.forEach(element => {
      this.agregar(element);
    });
  }

  columnas_consulta() {
    return new Promise((resolve, reject) => {
      let consulta_filtros = '';
      let consulta_columnas = '';

      if (this.columnas_filtros.length > 0) {
        Object.keys(this.filtros_val).forEach(element => {
          if (this.filtros_val[element] == '') {
            delete this.filtros_val[element];
          }
        });

        let columnas_filtra = Object.keys(this.filtros_val);
        columnas_filtra.forEach((element, i) => {
          let registro_columna: any = this.columnas_seleccionadas.filter(obj => obj.columna == element);
          let val_columna: any = (registro_columna[0].tipo == 'number') ? this.filtros_val[element] : `'${this.filtros_val[element]}'`;
          consulta_filtros += `${registro_columna[0].tabla}.${registro_columna[0].columna} =  ${val_columna} ${(i < columnas_filtra.length - 1) ? 'AND ' : ''}`;
        });
      }

      this.columnas_seleccionadas.forEach((element, i) => {
        let nombre_columna = (element.tipo == 'date') ? ` DATE_FORMAT(${element.tabla}.${element.columna}, '%d-%m-%Y') AS ${element.columna}` : `${element.tabla}.${element.columna}`;
        nombre_columna = (element.tipo == 'datetime-local') ? ` DATE_FORMAT(${element.tabla}.${element.columna}, '%d-%m-%Y %H:%i') AS ${element.columna}` : nombre_columna;
        consulta_columnas += `${nombre_columna} ${(i < this.columnas_seleccionadas.length - 1) ? ', ' : ''}`;
      });

      resolve({ 'consulta_filtros': consulta_filtros, 'consulta_columnas': consulta_columnas });
    });

  }

  async generarReporte() {
    this.registros = [];
    let obtener_columnas: any = await this.columnas_consulta();
    this.registros = await this.getRegitros(obtener_columnas.consulta_columnas, obtener_columnas.consulta_filtros);

  }

  getRegitros(columnas: any, filtros: any) {
    this.messagesService.showLoading();
    return new Promise((resolve, reject) => {
      let registros = [];
      let info = {
        'corporacion': this.plan_info.corporacion,
        'plan': this.plan_info.id,
        'columnas': columnas,
        'filtros': filtros
      }
      this.CereporteService.getRegistros(info).then(datas => {
        var res: any = datas;
        this.messagesService.closeLoading();
        if (res.codigo == 200) {
          registros = res.resultado;
          resolve(registros);
        } else {
          this.messagesService.showSuccessDialog('No existen registros.', 'warning');
        }

      });

    });

  }

  async excelRegistros() {
    let obtener_columnas: any = await this.columnas_consulta();
    let registros = await this.getRegitros(obtener_columnas.consulta_columnas, obtener_columnas.consulta_filtros);
    this.exportToExcel(registros);
  }

  exportToExcel(datos: any): void {
    const columnas: { name: any; filterButton: boolean; }[] = [];
    const registrosExcel: any[] = [];

    this.columnas_seleccionadas.forEach(colum => {
      columnas.push(
        {
          name: colum.columna_nombre,
          filterButton: true
        }
      );
    });

    datos.forEach((registro: any) => {
      registrosExcel.push(Object.values(registro));
    });

    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet("Reporte");
    const addTable = worksheet.addTable
    worksheet.addTable({
      name: 'MyTable',
      ref: 'A1',
      headerRow: true,
      style: {
        theme: 'TableStyleLight1',
        showRowStripes: true,
      },
      columns: columnas,
      rows: registrosExcel,
    });

    worksheet.columns.forEach(function (column, i) {
      worksheet.getColumn(i + 1).alignment = { wrapText: true };
      worksheet.getColumn(i + 1).width = 20;
    });

    //set downloadable file name
    let fname = "Reporte"
    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '-' + new Date().toLocaleString() + '.xlsx');
    });


  }



}
