import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, EMPTY } from 'rxjs';
import { retry, catchError, shareReplay} from 'rxjs/operators'
import { CovidData } from './covidinterface.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient)  { }


  getfullData(): Observable<CovidData> {

    return this.http.get<CovidData>("https://api.covid19india.org/data.json").pipe(
      retry(2)
    );

  }


  getStateData(): Observable<any> {
    return this.http.get<any>("https://api.covid19india.org/v2/state_district_wise.json").pipe(
      retry(2)
    )
  }


}
