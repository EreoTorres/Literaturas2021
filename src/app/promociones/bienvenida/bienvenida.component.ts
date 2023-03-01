import { Component, Input, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { BienvenidaService } from 'src/app/services/http-service/promociones/bienvenida/bienvenida.service';
import { SmartTableDatepickerComponent } from 'src/app/components/smart-table-datepicker/smart-table-datepicker.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-bienvenida',
  templateUrl: 'bienvenida.component.html',
  styleUrls: ['../../academica/literaturas/literaturas.component.css']
})
export class BienvenidaComponent implements OnInit {
  @Input() registros: any;

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    attr: {
      class: 'table table-bordered responsive'
    },
    pager: {
      perPage: 10,
    },
    columns: {
      nombre: {
        title: 'Nombre',
        type: 'string',
        width: '15%'
      },
      puesto: {
        title: 'Puesto',
        type: 'string',
        width: '15%'
      },
      empresa: {
        title: 'Empresa',
        type: 'string',
        width: '15%'
      },
      correo: {
        title: 'Correo',
        type: 'string',
        width: '15%'
      },
      telefono: {
        title: 'Teléfono',
        type: 'string',
        width: '15%'
      },
      corporacion: {
        title: 'Corporación',
        type: 'string',
        width: '15%'
      },
      fecha_registro: {
        title: 'Fecha de registro',
        type: 'string',
        filter: true,
        width: '10%',
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      }
    }
  };

  constructor(
    private bienvenidaHTTP: BienvenidaService,
    private MessagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.getBienvenida();
  }

  async getBienvenida() {
    this.MessagesService.showLoading();
    this.registros = await this.getRegistros();
    this.MessagesService.closeLoading();
  }

  getRegistros() {
    return new Promise((resolve, reject) => {
      this.bienvenidaHTTP.generico('getRegistros').then(datas => {
        var res: any = datas;
        resolve(res.resultado)
      });
    })
  }

  async getRegistrosExcel() {
    this.MessagesService.showLoading();
    let res: any = await this.getRegistros();
    this.exportToExcel(res);
  }

  exportToExcel(datos: any): void {
    const columnas: { name: any; filterButton: boolean; }[] = [];
    const registrosExcel: any[] = [];
    let nombre_columnas = ['Nombre', 'Puesto', 'Empresa', 'Correo', 'Teléfono', 'Corporación', 'Fecha Registro'];

    nombre_columnas.forEach(colum => {
      columnas.push(
        {
          name: colum,
          filterButton: true
        }
      );
    });

    datos.forEach((registro: any) => {
      let respuesta = {
        'nombre': registro.nombre,
        'puesto': registro.puesto,
        'empresa': registro.empresa,
        'correo': registro.correo,
        'telefono': registro.telefono,
        'corporacion': registro.corporacion,
        'fecha_registro': registro.fecha_registro
      }
      registrosExcel.push(Object.values(respuesta));
    });

    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet("Registros de Bienvenida");
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
      worksheet.getColumn(i + 1).width = 50;
    });

    //set downloadable file name
    let fname = "Reporte de Registros de Bienvenida"
    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
      this.MessagesService.closeLoading();
    });
  }

}
