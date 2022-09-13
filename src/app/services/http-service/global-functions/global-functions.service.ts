import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessagesService } from 'src/app/services/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(
    public http:HttpClient,
    private messagesService: MessagesService
  ) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  update(archivo: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'academica/' + archivo['modulo'] + '/update', archivo, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    })
  }

  uploadFile(archivo: any, files: File[], id: any) {
    const formData = new FormData();
    archivo.id = id;
    archivo.credencial_id = 1;
    archivo.ruta = archivo.modulo + '/' + archivo.id;

    const blobOverrides = new Blob([JSON.stringify(archivo)], {
      type: 'application/json',
    });

    formData.append('data', blobOverrides);
    formData.append('files', files[0]);

    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'generico/files/setFiles', formData)
      .subscribe(data => {
        archivo.archivo = data['resultado'][0].nombre_anterior;
        archivo.ruta = data['resultado'][0].nombre;
        resolve(this.update(archivo))
      })
    })
  }

  // ACTUALIZAR ARCHIVO
  actualizarArchivo(archivo: any, files: File[]) {
    return new Promise((resolve) => {
      this.messagesService.showLoading();
      this.update(archivo)
      .then(data => {
        return data;
      })
      .then(data => {
        return (files.length ? this.uploadFile(archivo, files, data['resultado'][0].id) : data);
      })
      .then (data => {
        this.messagesService.closeLoading();
        if(data['resultado'][0].success) {
          this.messagesService.showSuccessDialog(data['resultado'][0].message, 'success')
          .then(() => { resolve(true) });
        }
        else this.messagesService.showSuccessDialog('Error al actualizar archivo.', 'error');
      })
      .catch(err => this.messagesService.showSuccessDialog(err, 'error'))
    });
  }

  // DESCARGAR ARCHIVO
  descargarArchivo(ruta: string) {
    if(ruta) {
      var url = environment.urlProduccion + 'generico/files/downloadfile/1/' + ruta;
      window.open(url, "_blank");
    }
    else this.messagesService.showSuccessDialog('No se encontro archivo.', 'error');
  }

  // ELIMINAR ARCHIVO
  eliminarArchivo(archivo: any) {
    return new Promise((resolve) => {
      this.messagesService.showConfirmDialog('¿Seguro que deseas eliminarlo?', '')
      .then((result) => {
        if(result.isConfirmed) {
          this.messagesService.showLoading();
          this.update(archivo)
          .then(data => {
            this.messagesService.closeLoading();
            if(data['codigo'] == 200) {
              this.messagesService.showSuccessDialog(data['resultado'][0].message, 'success')
              .then((result) => {
                if(result.isConfirmed) resolve(true)
              });
            }
            else this.messagesService.showSuccessDialog('Error al eliminar archivo.', 'error');
          });
        }
      });
    });
  }

  // COPIAR VALOR
  obtenerRutaArchivo(valor: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = '';
    selBox.value = valor;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  fecha(fecha) {
    let dd = fecha.split("/")[0];
    let mm = fecha.split("/")[1];
    let yyyy = fecha.split("/")[2];
    if(mm.length == 1) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd;
  }

  newUYDate(pDate) {
    let dd = pDate.split("/")[0].padStart(2, "0");
    let mm = pDate.split("/")[1].padStart(2, "0");
    let yyyy = pDate.split("/")[2].split(" ")[0];

    if (mm.length == 1) {
      mm = '0' + mm;
    }

    if (pDate.split(" ")[1]) {
      let horas: any = pDate.split(" ")[1] + ':00';
      horas = horas.split(":");
      return yyyy + '-' + mm + '-' + dd + ' ' + horas[0] + ':' + horas[1] + ':' + horas[2];
    } else {
      return yyyy + '-' + mm + '-' + dd;
    }
  }

}
