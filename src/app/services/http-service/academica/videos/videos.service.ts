import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  public url = environment.urlProduccion;
  httpHeaders: any;

  constructor(public http:HttpClient) { 
    this.httpHeaders = {
      headers: new HttpHeaders({        
        'Content-Type': 'application/json'
      })
    };
  }

  getVideos(){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/videos/getVideos', {},this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }

  setVideos(video){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+'academica/videos/setVideos', video,this.httpHeaders)
      .subscribe(data => {
        resolve(data)
      })
    });
  }
}
