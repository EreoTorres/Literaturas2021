import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { MessagesService } from 'src/app/services/messages/messages.service';

@Component({
  selector: 'app-input-imagen',
  templateUrl: './input-imagen.component.html',
  styleUrls: ['./input-imagen.component.css']
})
export class InputImagenComponent extends DefaultEditor implements OnInit {
  nombre_file: any = '';
  titulo_btn: any = 'Cambiar Imagen';

  constructor(public MessagesService: MessagesService) {
    super(); // DemoClass constructor params
  }

  ngOnInit(): void {
    if(!this.cell.getValue()){
      this.titulo_btn = 'Agregar Imagen';
    }
  }

  onFileChange(ev){
    if(ev[0].size > 5242880){
      this.MessagesService.showSuccessDialog('El tamaño maximo de imagen es de 5MB.','error');
      return;
    }

    if(ev[0].type.indexOf('image/') == -1){
      this.MessagesService.showSuccessDialog('Solo se permiten formatos de imagen','error');
      return;
    }

    const file = ev[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      localStorage.setItem('base',reader.result+"");
    };

    this.nombre_file = ev[0].name;
    this.cell.newValue = this.nombre_file;
  }
}
