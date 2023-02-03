import { Injectable } from '@angular/core';
import Swal, {SweetAlertIcon} from 'sweetalert2';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {


  constructor() { }

  showConfirmDialog(message: string, topIconType: string = 'warning') {
    var sweetAlertType: SweetAlertIcon = 'warning';

    switch(topIconType){
      case "success":
        sweetAlertType = 'success';
      break;
      case "error":
        sweetAlertType = 'error';
      break;
      case "warning":
        sweetAlertType = 'warning';
      break;   
      case "info":
      sweetAlertType = 'info';
      break;   
      case "question":
        sweetAlertType = 'question';
      break;          
    }

    return Swal.fire({
        title: message,
        text: '',
        icon: sweetAlertType,        
        showCancelButton: true,
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
      });
  }

  showSuccessDialog(message: string, topIconType: string = 'success') {
    var sweetAlertType: SweetAlertIcon = 'success';
    
    switch(topIconType){
      case "success":
        sweetAlertType = 'success';
      break;
      case "error":
        sweetAlertType = 'error';
      break;
      case "warning":
        sweetAlertType = 'warning';
      break;   
      case "info":
      sweetAlertType = 'info';
      break;   
      case "question":
        sweetAlertType = 'question';
      break;          
    }

    return Swal.fire({
      title: message,
      text: "",
      buttonsStyling: false,
      icon: sweetAlertType,
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'btn btn-success'        
      }
    })
  }

  showNotification(topIconType: string = 'success',message: string){
    var sweetAlertType: SweetAlertIcon = 'error';

    switch(topIconType){
        case "success":
          sweetAlertType = 'success';
        break;
        case "error":
          sweetAlertType = 'error';
        break;
        case "warning":
          sweetAlertType = 'warning';
        break;   
        case "info":
        sweetAlertType = 'info';
        break;   
        case "question":
          sweetAlertType = 'question';
        break;          
      }

    return Swal.fire({
        title: message,
        text: "",
        buttonsStyling: false,
        icon: sweetAlertType,
        customClass: {
          confirmButton: 'btn btn-success'        
        }
      })
  }

  showLoading() {
    //https://codepen.io/tobynet/pen/vgbebJ
    return Swal.fire({
      title: 'Procesando... Por favor espere',
      allowEscapeKey: false,
      allowOutsideClick: false,
      onOpen: () => {
        Swal.showLoading();
      }
    })
  }

  closeLoading(){
    Swal.close();
  }

  closeAlert() {
    return Swal.close();
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
