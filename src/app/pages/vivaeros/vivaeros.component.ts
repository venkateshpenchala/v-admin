import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { ProgressInfo } from "../../@core/data/stats-progress-bar";
import { VivaerosService } from "./vivaeros.service";
import { NumberWithCommasPipe } from "../../@theme/pipes";
import * as echarts from 'echarts';
import { VivaerosPieComponent } from "./echarts/piechart.component";
import { Vivaeros } from "./models/vivaeros";

@Component({
  selector: 'vivaeros-dashboard',
  styleUrls: ['./vivaeros.component.scss'],
  templateUrl: './vivaeros.component.html',
})
export class VivaerosDashboardComponent implements OnDestroy {

  constructor(private VivaerosService: VivaerosService, private numberWithComma: NumberWithCommasPipe) {
  }

  @ViewChild('pieChart', { static: true }) pieChart!:VivaerosPieComponent;

  public static options = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  } as const;

  sum = '0';
  total = 0;
  weekAgoTotal = 0;
  VaM = 0;
  VaO = 0;
  VaP = 0;
  compareStr = '';
  forecast = 0;
  percentageIncrease = 0;
  chartData: Vivaeros[] = [];
  barChartData:number[] =[];

  get progressInfoData(): ProgressInfo[] {
    return [
      {
        title: 'Today’s Profit',
        value: this.sum,
        isCurrency: true,
        description: this.compareStr + ' than last week (' + this.percentageIncrease + '%)',
      },
      {
        title: 'This month Forecast',
        value: this.forecast+'',
        isCurrency: true,
        description: '',
      }
    ];
  }

  webhits: ProgressInfo[] = [
    {
      title: 'Today’s Web hits',
      value: '1020',
      isCurrency: false,
      description: '',
    },
    {
      title: 'This month Web hits',
      value: '12000',
      isCurrency: false,
      description: '',
    }
  ];

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.total = 0;
    this.GetOrderData();

    const stylesheet = document.styleSheets[0];
    stylesheet.insertRule('.nb-layout .layout { background-color: #dddfe4 !important;}', stylesheet.cssRules.length);
  }

  GetOrderData() {
    const startOfToday: Date = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday: Date = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfTodayFormatted = startOfToday.toLocaleString('en-US', VivaerosDashboardComponent.options);
    const endOfTodayFormatted = endOfToday.toLocaleString('en-US', VivaerosDashboardComponent.options);
    let page = 1;
    this.GetOrdersWithPages(startOfTodayFormatted, endOfTodayFormatted, page);

    this.GetWeekAgoOrders();
  }

  GetOrdersWithPages(startOfTodayFormatted, endOfTodayFormatted, page) {
    this.VivaerosService.getOrderData(startOfTodayFormatted, endOfTodayFormatted, page).then(order => order.subscribe(
      (data:any) => {
        if(data['Data'].length != 0) {
          let orderData = data['Data'];
          orderData.forEach(order => {
            this.total += (order['TotalCost'] - order['ShippingCost']);
            order['OrderItems'].forEach(item => {
              if(item['Product']['Title'].indexOf('Mature') > -1) {
                this.VaM += item['TotalPrice'];
                this.VaM =  Math.round(this.VaM * 100) / 100;
              }
              else if(item['Product']['Title'].indexOf('Original') > -1) {
                this.VaO += item['TotalPrice'];
                this.VaO =  Math.round(this.VaO * 100) / 100;
              }
              else if(item['Product']['Title'].indexOf('Petite') > -1) {
                this.VaP += item['TotalPrice'];
                this.VaP =  Math.round(this.VaP * 100) / 100;
              }
            });
          });

          if(data['Paging']['TotalPages'] > 1 && page < data['Paging']['TotalPages']) {
            page++;
            this.GetOrdersWithPages(startOfTodayFormatted, endOfTodayFormatted, page);
          }
        }

        this.chartData = [
          {name: 'Va Original', value: this.VaO},
          {name: 'Va Mature', value: this.VaM},
          {name: 'Va P', value: this.VaP}
        ];

        this.barChartData = [this.VaO, this.VaM, this.VaP];

        this.sum = this.numberWithComma.transform(this.total);
        this.progressInfoData[0].value = this.sum;
      }
    ))
  }

  GetDateOneWeekAgo(): Date {
    let date = new Date();
    // Get the timestamp of the given date
    const timestamp = date.getTime();

    // Calculate the timestamp of one week ago (7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const oneWeekAgoTimestamp = timestamp - (7 * 24 * 60 * 60 * 1000);

    // Create a new date object from the one week ago timestamp
    const oneWeekAgoDate = new Date(oneWeekAgoTimestamp);

    // Return the one week ago date
    return oneWeekAgoDate;
  }

  async GetWeekAgoOrders() {
    let startOfToday: Date = this.GetDateOneWeekAgo();
    startOfToday.setHours(0, 0, 0, 0);

    let endOfToday: Date = this.GetDateOneWeekAgo();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfTodayFormatted = startOfToday.toLocaleString('en-US', VivaerosDashboardComponent.options);
    const endOfTodayFormatted = endOfToday.toLocaleString('en-US', VivaerosDashboardComponent.options);
    let page = 1;
    this.GetAWeekAgoData(startOfTodayFormatted, endOfTodayFormatted, page);
  }

  GetAWeekAgoData(startOfTodayFormatted, endOfTodayFormatted, page) {
    this.VivaerosService.getOrderData(startOfTodayFormatted, endOfTodayFormatted, page).then(order => order.subscribe(
      (data:any) => {
        if(data['Data'].length != 0) {
          let orderData = data['Data'];
          orderData.forEach(order => {
            this.weekAgoTotal += (order['TotalCost'] - order['ShippingCost']);
          });

          if(data['Paging']['TotalPages'] > 1 && page < data['Paging']['TotalPages']) {
            page++;
            this.GetAWeekAgoData(startOfTodayFormatted, endOfTodayFormatted, page);
          }

          if(this.total < this.weekAgoTotal) {
              this.compareStr = 'Lesser';
              this.percentageIncrease = ((this.weekAgoTotal - this.total) / this.weekAgoTotal ) * 100;
          } else {
              this.compareStr = 'Better';
              this.percentageIncrease = ((this.total - this.weekAgoTotal) / this.weekAgoTotal ) * 100;
          }

          this.percentageIncrease = Math.abs(Math.round(this.percentageIncrease));

          this.forecast = this.ForecastMonthlyProfit(this.total, this.weekAgoTotal, new Date());
        }
      }));
  }

  ForecastMonthlyProfit(currentDailyProfit: number, profitOneWeekAgo: number, currentDate: Date): number {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Calculate the total profit from the current day until the end of the week
    const daysInWeek = 7 - (currentDate.getDay() + 6) % 7; // Calculate the number of days until the end of the week (Sunday)
    const remainingProfit = daysInWeek * currentDailyProfit;

    // Estimate the total profit for the current week based on the profit from one day a week ago
    const profitFromOneDayAgo = profitOneWeekAgo / daysInWeek;
    const dailyProfitsLastWeek = [profitFromOneDayAgo, /* insert daily profits for last 6 days here */];
    const totalProfitLastWeek = dailyProfitsLastWeek.reduce((acc, cur) => acc + cur, 0);
    const averageDailyProfitLastWeek = totalProfitLastWeek / 7;
    const totalForecastedProfitThisWeek = averageDailyProfitLastWeek * daysInWeek;

    // Calculate the average daily profit for the month so far, excluding the current week
    const daysInMonthSoFar = currentDate.getDate() - daysInWeek;
    const totalProfitSoFar = (daysInMonthSoFar * currentDailyProfit) + totalForecastedProfitThisWeek;
    const averageDailyProfitSoFar = totalProfitSoFar / daysInMonthSoFar;

    // Extrapolate the average daily profit to estimate the remaining profit for the month
    const remainingDays = daysInMonth - daysInMonthSoFar - daysInWeek;
    const estimatedRemainingProfit = remainingDays * averageDailyProfitSoFar;

    // Add up the total profit from the current week and the estimated remaining profit
    const totalForecastedProfit = Math.abs(Math.round(totalForecastedProfitThisWeek + estimatedRemainingProfit));

    return totalForecastedProfit;
  }
}
