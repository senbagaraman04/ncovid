export interface CasesTimeSeries {
  dailyconfirmed: string;
  dailydeceased: string;
  dailyrecovered: string;
  date: string;
  totalconfirmed: string;
  totaldeceased: string;
  totalrecovered: string;
}

export interface Statewise {
  active: string;
  confirmed: string;
  deaths: string;
  deltaconfirmed: string;
  deltadeaths: string;
  deltarecovered: string;
  lastupdatedtime: string;
  recovered: string;
  state: string;
  statecode: string;
  statenotes: string;
}

export interface Tested {
  _ckd7g: string;
  source: string;
  testsconductedbyprivatelabs: string;
  totalindividualstested: string;
  totalpositivecases: string;
  totalsamplestested: string;
  updatetimestamp: string;
}

export interface CovidData {
    cases_time_series: CasesTimeSeries[];
    statewise: Statewise[];
    tested: Tested[];
}

export interface DistrictWise {
  state: string;
  districtData: DistrictData[];
}

export interface DistrictData {
  district: string;
  confirmed: number;
  lastupdatedtime: string;
  delta: Delta;
}

export interface Delta {
  confirmed: number;
}

export interface GrowthFactor {
    date: string;
    newCases?: number;
    growthFactor: number;
}




export function SuperPlaceholder(options) {
  this.options = options;
  this.element = options.element;
  this.placeholderIdx = 0;
  this.charIdx = 0;


  this.setPlaceholder = function() {
      const placeholder = options.placeholders[this.placeholderIdx];
      const placeholderChunk = placeholder.substring(0, this.charIdx + 1);
      document.querySelector(this.element).setAttribute('placeholder', this.options.preText + ' ' + placeholderChunk);
  };

  this.onTickReverse = function(afterReverse) {
    if (this.charIdx === 0) {
      afterReverse.bind(this)();
      clearInterval(this.intervalId);
      this.init();
    } else {
      this.setPlaceholder();
      this.charIdx--;
    }
  };

  this.goReverse = function() {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this.onTickReverse.bind(this, function() {
        this.charIdx = 0;
        this.placeholderIdx++;
        if (this.placeholderIdx === options.placeholders.length) {
          // end of all placeholders reached
          this.placeholderIdx = 0;
        }
      }), this.options.speed);
  };

  this.onTick = function() {
      const placeholder = options.placeholders[this.placeholderIdx];
      if (this.charIdx === placeholder.length) {
        // end of a placeholder sentence reached
        setTimeout(this.goReverse.bind(this), this.options.stay);
      }

      this.setPlaceholder();

      this.charIdx++;
    };

  this.init = function() {
    this.intervalId = setInterval(this.onTick.bind(this), this.options.speed);
  };

  this.kill = function() {
    clearInterval(this.intervalId);
  };
}
