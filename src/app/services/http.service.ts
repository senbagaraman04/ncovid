import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CovidData } from './covidinterface.service';
/**
 * HttpService service  call for api calls
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  private covid19ApiURL = 'https://data.covid19india.org/';


  /**
   * @returns returns full data in json format
   */
  getfullData(): Observable<CovidData> {
    return this.http.get<any>(this.covid19ApiURL + 'data.json');
  }

  /**
   * @returns state data fully
   */
  getStateData(): Observable<any> {
    return this.http.get<any>(this.covid19ApiURL + 'v2/state_district_wise.json');
  }

  /**
   * @param selectedDate particular date to be selected
   * @returns data for the selected date
   */
  getFullDataonDate(selectedDate): Observable<any> {
    return this.http.get<any>(this.covid19ApiURL + 'v3/min/data-' + selectedDate + '.min.json');
  }


  getStateWiseData(): Observable<any> {
    return this.http.get<any>(this.covid19ApiURL + 'v4/min/data.min.json');
  }

}
