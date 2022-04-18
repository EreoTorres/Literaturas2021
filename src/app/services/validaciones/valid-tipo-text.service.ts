import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidTipoTextService {

  constructor() { }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : 
      event.charCode >= 48 && event.charCode <= 57  ||
      event.charCode >= 224 && 
      event.charCode <= 255;
  }

  onlyTextKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : 
      event.charCode >= 97 && event.charCode <= 122 || 
      event.charCode >= 65 && event.charCode <= 90 || 
      event.charCode == 32 || event.charCode == 255;
  }

  onlyTextAndNumers(event){
    return 
      (event.charCode == 8 || event.charCode == 0) ? null : 
      event.charCode >= 97 && event.charCode <= 122 || 
      event.charCode >= 65 && event.charCode <= 90 || 
      event.charCode == 32 || 
      event.charCode >= 48 && event.charCode <= 57;
  }

  onlyTextAndCharacters(event){
    return 
      (event.charCode == 8 || event.charCode == 0) 
      ? null : 
      event.charCode >= 97 && event.charCode <= 122 || //mayusculas
      event.charCode >= 65 && event.charCode <= 90 ||  //minusculas
      event.charCode == 32 || 
      event.charCode >= 48 && event.charCode <= 57; //numeros
  }
}