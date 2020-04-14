import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import {CovidData, Statewise, CasesTimeSeries} from '../services/covidinterface.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  country: Statewise;
  timeSeriesStates: CasesTimeSeries[];
  states: Statewise[];

  constructor(private httpService:HttpService) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
  this.httpService.getfullData().subscribe( (response) => {
    console.log(response)
      this.country = response.statewise[0];
      this.timeSeriesStates = response.cases_time_series;
      this.states =response.statewise.slice(1);
  }

  )
  }

}
