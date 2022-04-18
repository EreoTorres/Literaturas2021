import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) { 
    this.httpHeaders = {
      headers: new HttpHeaders({        
        'Content-Type': 'application/json'
      })
    };
  }

  getProgramacion(){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'promocion/programacion/getProgramacion',{}, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }

  setProgramacion(programacion){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'promocion/programacion/setProgramacion', programacion, this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }
}
