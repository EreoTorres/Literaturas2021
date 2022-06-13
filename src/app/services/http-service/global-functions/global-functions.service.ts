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

  update(archivo) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'academica/' + archivo['modulo'] + '/update', archivo, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  uploadFile(formdata) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'generico/files/setFiles', formdata)
      .subscribe(data => {
          resolve(data)
      })
    })
  }

  // INICIO FUNCIONES GLOBALES ARCHIVOS GENERICOS

  // GUARDAR ARCHIVO
  guardarArchivo(archivo, files) {
    return new Promise((resolve) => {
      this.messagesService.showLoading();
      this.update(archivo)
      .then(data => {
        return data['resultado'][0].id;
      })
      .then(data => {
        const formData = new FormData();
        archivo.id = data;
        archivo.credencial_id = 1;
        archivo.ruta = archivo.modulo + '/' + archivo.id;

        const blobOverrides = new Blob([JSON.stringify(archivo)], {
          type: 'application/json',
        });

        formData.append('data', blobOverrides);
        formData.append('files', files[0]);

        return this.uploadFile(formData)
      })
      .then(data => {
        archivo.archivo = data['resultado'][0].nombre_anterior;
        archivo.ruta = data['resultado'][0].nombre;
        return this.update(archivo);
      })
      .then (data => {
        this.messagesService.closeLoading();
        if(data['resultado'][0].success) {
          this.messagesService.showSuccessDialog(data['resultado'][0].message, 'success')
          .then(() => {
            resolve(true)
          });
        }
        else this.messagesService.showSuccessDialog('Error al registrar archivo.', 'error');
      })
      .catch(err => this.messagesService.showSuccessDialog(err, 'error'))
    });
  }

  // DESCARGAR ARCHIVO
  descargarArchivo(ruta) {
    if(ruta) {
      var url = environment.urlProduccion + 'generico/files/downloadfile/1/' + ruta;
      window.open(url, "_blank");
    }
    else this.messagesService.showSuccessDialog('No se encontro archivo.', 'error');
  }

  // ELIMINAR ARCHIVO
  eliminarArchivo(archivo) {
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
  obtenerRutaArchivo(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = '';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  // FIN FUNCIONES GLOBALES ARCHIVOS GENERICOS
}
