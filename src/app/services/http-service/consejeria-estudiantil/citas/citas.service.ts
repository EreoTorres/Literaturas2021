import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) {
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getCitas() {
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'consejeria_estudiantil/citas/getCitas',{}, this.httpHeaders)
      .subscribe(data => {
          resolve(data)
      })
    })
  }
}
