import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { CovidData } from './covidinterface.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  private covid19ApiURL = 'https://data.covid19india.org/';


  getfullData(): Observable<CovidData> {

    return this.http.get<any>(this.covid19ApiURL + 'data.json').pipe(
      retry(2)
    );

  }


  getStateData(): Observable<any> {
    return this.http.get<any>(this.covid19ApiURL + 'v2/state_district_wise.json').pipe(
      retry(2)
    );
  }


  getFullDataonDate(selectedDate): Observable<any> {
    return this.http.get<any>(this.covid19ApiURL + 'v3/min/data-' + selectedDate + '.min.json').pipe(
      retry(2)
    );
  }



  getStateWiseData(): Observable<any> {
    return this.http.get<any>(this.covid19ApiURL + 'v3/min/data.min.json').pipe(retry(2));
  }

}
