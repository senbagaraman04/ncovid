import { Component, OnInit, NgZone } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Statewise, CasesTimeSeries, SuperPlaceholder } from '../services/covidinterface.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import * as $ from 'jquery';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, AfterViewInit {
  country: Statewise;
  timeSeriesStates: CasesTimeSeries[];
  states: Statewise[];
  subscription: Subscription;
  statusText: string;
  displayedColumns: string[] = ['State', 'Recovered', 'Confirmed', 'Deaths', 'Active'];
  data = new MatTableDataSource(null);
  searchText;
  loading = true;
  dailyConfirmedCases = [];
  dailyDeceasedCases = [];
  dailyRecoveredCases = [];
  linechartConfirmed: any;
  linechartRecovered: any;
  linechartDeceased: any;
  dateData = [];
  minDate: Date;
  maxDate: Date;
  public from;
  m: any;
  showTable = true;
  stateNames = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh',
    'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand',
    'Uttar Pradesh', 'West Bengal',  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'];

    stateCodes = [];
  stateStatus = [];
  selectedDate: any;
  receivedData: any;
  clickedData: any;
  loadCardData = false;
  showAlert = false;
 sp;
  constructor(private httpService: HttpService, private router: Router, private zone: NgZone) { }




  ngOnInit(): void {

    this.httpService.getfullData().subscribe(response => {
      this.timeSeriesStates = response.cases_time_series;
      this.loadGraphData();
    });


    this.subscription = timer(0, 1000000).pipe(switchMap(() => this.httpService.getfullData())).subscribe(response => {
      this.country = response.statewise[0];
      this.states = response.statewise.slice(1);
      console.log(this.states);
      this.data = new MatTableDataSource(this.states);
      this.loading = false;

    });

    this.zone.runOutsideAngular(() => {
      this.sp = new SuperPlaceholder({
        placeholders: ['Tamil Nadu', 'Kerala', 'Delhi', 'Arunachal Pradesh', 'Sikkim'],
      preText: '',
        stay: 100,
        speed: 100,
        element: '#dynamic-placeholder'
      });
      this.sp.init();
    });
  }



  ngAfterViewInit(): void {
    this.data = new MatTableDataSource(this.states);
  }




  /**
   * To load the data into Graphs
   */
  loadGraphData(): void {
    console.log(this.from);

    this.timeSeriesStates.forEach(res => {
      this.dailyConfirmedCases.push(res.dailyconfirmed);
      this.dailyRecoveredCases.push(res.dailyrecovered);
      this.dailyDeceasedCases.push(res.dailydeceased);
      this.dateData.push(res.date);

    });

    this.linechartConfirmed = new Chart('covidCharts', {
      type: 'line',
      data: {
        labels: this.dateData,
        datasets: [
          {
            data: this.dailyConfirmedCases,
            label: 'Confirmed',
            borderColor: 'red'
          },
          {
            data: this.dailyRecoveredCases,
            label: 'Recovered',
            borderColor: 'green'
          },
          {
            data: this.dailyDeceasedCases,
            label: 'Deceased',
            borderColor: '#0000FF'
          }
        ]
      },
      options: {
        legend: {
          display: true,
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });

  }

  rowRedirect(row, Event: Event): void {
    if (row.statecode !== 'UN') {
      sessionStorage.setItem('rowData', JSON.stringify(row));
      this.router.navigate(['/state-wise/stateWise']);
    }
  }


  applyFilter(event: Event): void {
    this.data.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();

  }



  onSubmitButtonClick(): void {

    this.loadCardData = false;

    const sday = new Date(this.from);
    const tday = new Date();


    if ( tday as any -  sday as any > 0 && this.from !== undefined) {
      this.showTable = false;
      this.showAlert = false;
      this.httpService.getFullDataonDate(this.from).subscribe(particularResponse => {
        this.receivedData = particularResponse;
        this.selectedDate = this.from;
      });
    } else {
      this.showAlert = true;
    }

    setTimeout(() => {
      $('#alertMessage').fadeOut('fast');
  }, 30000);

  }



  clickedtoOpen(stateName): void {
    this.loadCardData =  true; // !this.loadCardData;
    const returnSelectedStateCode = this.selectedStateCode(stateName);
    this.clickedData = this.receivedData[returnSelectedStateCode];
  }


/**
 * Returns the two digit code for passed state
 */
  selectedStateCode(state): string {
    let stateCode;

    switch (state) {
      case 'Andhra Pradesh' : stateCode = 'AP'; break;
      case 'Arunachal Pradesh' : stateCode = 'AR'; break;
      case 'Andaman and Nicobar Islands' : stateCode = 'AN'; break;
      case 'Bihar' : stateCode = 'BR'; break;
      case 'Chandigarh' : stateCode = 'CH'; break;
      case 'Chhattisgarh' : stateCode = 'CT'; break;
      case 'Delhi' : stateCode = 'DL'; break;
      case 'Daman and Diu' : stateCode = 'DN'; break;
      case 'Goa' : stateCode = 'GA'; break;
      case 'Gujarat' : stateCode = 'GJ'; break;
      case 'Haryana' : stateCode = 'HR'; break;
      case 'Himachal Pradesh' : stateCode = 'HP'; break;
      case 'Jammu and Kashmir' : stateCode = 'JK'; break;
      case 'Jharkhand' : stateCode = 'JH'; break;
      case 'Karnataka' : stateCode = 'KA'; break;
      case 'Kerala' : stateCode = 'KL'; break;
      case 'Madhya Pradesh' : stateCode = 'MP'; break;
      case 'Maharashtra' : stateCode = 'MH'; break;
      case 'Manipur' : stateCode = 'MN'; break;
      case 'Meghalaya' : stateCode = 'ML'; break;
      case 'Mizoram' : stateCode = 'MZ'; break;
      case 'Nagaland' : stateCode = 'NL'; break;
      case 'Odisha' : stateCode = 'OR'; break;
      case 'Punjab' : stateCode = 'PB'; break;
      case 'Rajasthan' : stateCode = 'RJ'; break;
      case 'Sikkim' : stateCode = 'SK'; break;
      case 'Tamil Nadu' : stateCode = 'TN'; break;
      case 'Telangana' : stateCode = 'TG'; break;
      case 'Tripura' : stateCode = 'TR'; break;
      case 'Uttarakhand' : stateCode = 'UT'; break;
      case 'Uttar Pradesh' : stateCode = 'UP'; break;
      case 'West Bengal' : stateCode = 'WB'; break;
      case 'Dadra and Nagar Haveli' : stateCode = 'DN'; break;
      case 'Lakshadweep' : stateCode = 'LD'; break;
      case 'Puducherry' : stateCode = 'PY'; break;

    }


    return stateCode;

  }

}


