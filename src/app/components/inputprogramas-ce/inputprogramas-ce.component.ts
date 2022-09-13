import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { EventosService } from 'src/app/services/http-service/consejeria-estudiantil/eventos/eventos.service';
import { MessagesService } from 'src/app/services/messages/messages.service';

@Component({
  selector: 'app-inputprogramas-ce',
  templateUrl: './inputprogramas-ce.component.html',
  styleUrls: ['./inputprogramas-ce.component.css']
})
export class InputprogramasCeComponent extends DefaultEditor implements OnInit {
  programas: any = []

  constructor(
    private eventosHTTP: EventosService,
    private messagesService: MessagesService
  ) {
    super();
  }

  ngOnInit() {
    let tipo = (this.cell.getValue() ? 1 : 2)

    this.messagesService.showLoading()
    this.eventosHTTP.generico('getProgramas', {tipo: tipo}).then(datas => {
      var res: any = datas
      this.programas = res.resultado      
      
      this.cell.newValue = (!this.cell.getValue() ? 'TODOS' : this.getIdPrograma(this.cell.getValue()))

      this.messagesService.closeLoading()
    });
  }

  getIdPrograma(title: string) {
    let id_programa = 0
    for (let i = 0; i < this.programas.length; i++) {
      if(this.programas[i].title == title) {
        id_programa = this.programas[i].value
        break
      }
    }
    
    return id_programa    
  }

}
