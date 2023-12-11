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
  customTotal = 0;
  monthlyTotal = 0;
  weekAgoTotal = 0;
  VaONum = 0;
  VaMNum = 0;
  VaPNum = 0;
  VaM = 0;
  VaO = 0;
  VaP = 0;
  compareStr = '';
  forecast = 0;
  percentageIncrease = 0;
  chartData: Vivaeros[] = [];
  barChartData =[];
  activeUsersByCountry = [];
  activeUsersByDevice = [];

  get progressInfoData(): ProgressInfo[] {
    return [
      {
        title: 'This month',
        value: this.monthlyTotal+'',
        isCurrency: true,
        style: {"font-size": "38px"},
        description: ''
      },
      {
        title: 'This month forecast',
        value: Number(this.forecast.toFixed(2))+'',
        isCurrency: true,
        style: {"color":"green", "font-size": "38px"},
        description: '',
      }
    ];
  }

  get monthlyData(): ProgressInfo[] {
    return [
      {
        title: 'This month',
        value: this.monthlyTotal+'',
        isCurrency: true,
        style: {},
        description: ''
      }
    ]
  }

  webhits: ProgressInfo[] = [
    {
      title: 'Today’s web hits',
      value: '1020',
      isCurrency: false,
      style: {},
      description: '',
    },
    {
      title: 'This month web hits',
      value: '12000',
      style: {},
      isCurrency: false,
      description: '',
    }
  ];

  ranking = [
    'USA',
    'India',
    'Germany',
    'China',
    'Italy'
  ];

  shops = [
    {
      sum: 0,
      shop: 'WooCommerce Shop'
    },
    {
      sum: 0,
      shop: 'e-Bay'
    },
    {
      sum: 0,
      shop: 'amazon europe'
    },
    {
      sum: 0,
      shop: 'amazon com'
    },
    {
      sum: 0,
      shop: 'Etsy'
    },
    {
      sum: 0,
      shop: 'Ebay NEU'
    },
    {
      sum: 0,
      shop: 'others'
    }
  ];

  shopRanking = [];

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.total = 0;
    this.GetOrderData();
    this.GetGoogleCountriesData();
    this.GetGoogleDeviceCategory();

    this.InitiateConfigData();

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
    // this.GetMonthlyOrder();
  }

  GetOrdersWithPages(startOfTodayFormatted, endOfTodayFormatted, page) {
    this.VivaerosService.getOrderData(startOfTodayFormatted, endOfTodayFormatted, page).then(order => order.subscribe(
      (data:any) => {
        if(data['Data'].length != 0) {
          let orderData = data['Data'];
          this.VaMNum = 0;
          this.VaONum = 0;
          this.VaPNum = 0;
          this.VaM = 0;
          this.VaO = 0;
          this.VaP = 0;
          this.shopRanking = []
          orderData.forEach(order => {
            let orderValue = (order['TotalCost'] - order['ShippingCost'])
            this.total += orderValue;
            order['OrderItems'].forEach(item => {
              if(item['Product']['Title'].indexOf('Mature') > -1) {
                this.VaM += item['TotalPrice'];
                this.VaMNum++;
                this.VaM =  Math.round(this.VaM * 100) / 100;
              }
              else if(item['Product']['Title'].indexOf('Original') > -1) {
                this.VaO += item['TotalPrice'];
                this.VaONum++;
                this.VaO =  Math.round(this.VaO * 100) / 100;
              }
              else if(item['Product']['Title'].indexOf('Petite') > -1) {
                this.VaP += item['TotalPrice'];
                this.VaPNum++;
                this.VaP =  Math.round(this.VaP * 100) / 100;
              }
            });


            switch(order['Seller']['BillbeeShopName']) {
              case 'WooCommerce Shop': {
                const amazonEuropeShop = this.shops.find(shop => shop.shop === 'WooCommerce Shop');
                if (amazonEuropeShop) {
                  amazonEuropeShop.sum += orderValue;
                }
                break;
              }
              case 'e-Bay': {
                const amazonEuropeShop = this.shops.find(shop => shop.shop === 'e-Bay');
                if (amazonEuropeShop) {
                  amazonEuropeShop.sum += orderValue;
                }
                break;
              }
              case 'amazon europe': {
                const amazonEuropeShop = this.shops.find(shop => shop.shop === 'amazon europe');
                if (amazonEuropeShop) {
                  amazonEuropeShop.sum += orderValue;
                }
                break;
              }
              case 'amazon com': {
                const amazonEuropeShop = this.shops.find(shop => shop.shop === 'amazon com');
                if (amazonEuropeShop) {
                  amazonEuropeShop.sum += orderValue;
                }
                break;
              }
              case 'Etsy': {
                const amazonEuropeShop = this.shops.find(shop => shop.shop === 'Etsy');
                if (amazonEuropeShop) {
                  amazonEuropeShop.sum += orderValue;
                }
                break;
              }
              case 'Ebay NEU': {
                const amazonEuropeShop = this.shops.find(shop => shop.shop === 'Ebay NEU');
                if (amazonEuropeShop) {
                  amazonEuropeShop.sum += orderValue;
                }
                break;
              }
              default: {
                const amazonEuropeShop = this.shops.find(shop => shop.shop === 'others');
                if (amazonEuropeShop) {
                  amazonEuropeShop.sum += orderValue;
                }
                break;
              }
            }
          });

          if(data['Paging']['TotalPages'] > 1 && page < data['Paging']['TotalPages']) {
            page++;
            this.GetOrdersWithPages(startOfTodayFormatted, endOfTodayFormatted, page);
          }
          this.shops = this.shops.sort((a, b) => b.sum - a.sum);
          this.shops.forEach(shop => {
            if(shop.sum != 0) {
              this.shopRanking.push(shop);
            }
          });
        }

        this.chartData = [
          {name: 'VULVA Original', value: this.VaO},
          {name: 'VULVA Mature', value: this.VaM},
          {name: 'pedites original', value: this.VaP}
        ];

        // this.barChartData = [this.VaO, this.VaM, this.VaP];

        this.barChartData = [{
          value: this.VaO,
          label: {
            show: true,
            position: 'inside',
            fontSize: 22,
            fontWeight: 'bold',
            formatter: (params) => {
              return params.value > 0 ? `${this.VaO}\n\n(${this.VaONum})` : '';
            }
        }
        },{
          value: this.VaM,
          label: {
            show: true,
            position: 'inside',
            fontSize: 22,
            fontWeight: 'bold',
            formatter: (params) => {
              return params.value > 0 ? `${this.VaM}\n\n(${this.VaMNum})` : '';
            }
          }
        }, {
          value: this.VaP,
          label: {
            show: true,
            position: 'inside',
            fontSize: 22,
            fontWeight: 'bold',
            formatter: (params) => {
              return params.value > 0 ? `${this.VaP}\n\n(${this.VaPNum})` : '';
            }
          }
        }];

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

  GetLastMonthDate(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth();

    // handle special case for January
    if (month === 0) {
      return new Date(year - 1, 11, date.getDate());
    }

    // handle special case for February
    if (month === 1) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const lastDayOfMonth = isLeapYear ? 29 : 28;
      const lastMonth = new Date(year, month - 1, lastDayOfMonth);
      const lastMonthDay = Math.min(date.getDate(), lastDayOfMonth);
      return new Date(year, month - 1, lastMonthDay);
    }

    // handle other months
    const lastMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const lastMonthDay = Math.min(date.getDate(), lastDayOfMonth);
    return new Date(year, month - 1, lastMonthDay);
  }

  GetBeginningOfMonth(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1);
  }

  async GetWeekAgoOrders() {
    let startOfToday: Date = this.GetLastMonthDate(new Date());
    startOfToday.setHours(0, 0, 0, 0);

    let endOfToday: Date = this.GetLastMonthDate(new Date());
    endOfToday.setHours(23, 59, 59, 999);

    const startOfTodayFormatted = startOfToday.toLocaleString('en-US', VivaerosDashboardComponent.options);
    const endOfTodayFormatted = endOfToday.toLocaleString('en-US', VivaerosDashboardComponent.options);
    let page = 1;
    this.customTotal = 0;
    this.weekAgoTotal = await this.GetPastData(startOfTodayFormatted, endOfTodayFormatted, page, 'week');

    if(this.total < this.weekAgoTotal) {
      this.compareStr = 'Lesser';
      this.percentageIncrease = ((this.weekAgoTotal - this.total) / this.weekAgoTotal ) * 100;
    } else {
        this.compareStr = 'Better';
        this.percentageIncrease = ((this.total - this.weekAgoTotal) / this.weekAgoTotal ) * 100;
    }

    this.percentageIncrease = Math.abs(Math.round(this.percentageIncrease));

    this.GetMonthlyOrder();
  }

  async GetMonthlyOrder() {
    const startOfToday: Date = this.GetBeginningOfMonth(new Date());
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday: Date = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfTodayFormatted = startOfToday.toLocaleString('en-US', VivaerosDashboardComponent.options);
    const endOfTodayFormatted = endOfToday.toLocaleString('en-US', VivaerosDashboardComponent.options);
    let page = 1;
    this.customTotal = 0;

    this.monthlyTotal = await this.GetPastData(startOfTodayFormatted, endOfTodayFormatted, page, 'month');
  }

  async GetPastData(startOfTodayFormatted, endOfTodayFormatted, page, criteria): Promise<number> {
    return new Promise(async (resolve) => {
      const order = await this.VivaerosService.getOrderData(startOfTodayFormatted, endOfTodayFormatted, page);
      order.subscribe((data: any) => {
        if (data['Data'].length != 0) {
          let orderData = data['Data'];
          orderData.forEach(order => {
            this.customTotal += (order['TotalCost'] - order['ShippingCost']);
          });

          if (data['Paging']['TotalPages'] > 1 && page < data['Paging']['TotalPages']) {
            page++;
            this.GetPastData(startOfTodayFormatted, endOfTodayFormatted, page, criteria);
          }

          if (criteria == 'week') {
            this.weekAgoTotal = this.customTotal;
          } else if(criteria == 'month') {
            this.monthlyTotal  = this.customTotal;
            this.forecast = this.Forecast(this.monthlyTotal, new Date());
          }
          resolve(this.customTotal);
        } else {
          resolve(0);
        }
      });
    });
  }



  Forecast(totalOrderValueCurrentMonth: number, currentDate: Date): number {
    // Get the current day of the month
    const currentDay = currentDate.getDate();

    // Get the total number of days in the current month
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Calculate the average daily sales for the current month until today
    const averageDailySales = totalOrderValueCurrentMonth / currentDay;

    // Estimate the remaining days in the month
    const remainingDays = daysInMonth - currentDay;

    // Calculate the projected sales for the remaining days
    const projectedSales = averageDailySales * remainingDays;

    // Calculate the forecast for the total sales by the end of the month
    const forecast = totalOrderValueCurrentMonth + projectedSales;

    return forecast;
}

  GetGoogleCountriesData() {
    this.VivaerosService.getCountries().then(order => order.subscribe(
      (data:any) => {
        if(data['rows'].length != 0) {
          this.activeUsersByCountry = data.rows.map(row => {
            return {
              country: row.dimensionValues[0].value,
              activeUsers: row.metricValues[0].value
            }
          });

          this.ranking =[];

          this.activeUsersByCountry.sort((a, b) => b.activeUsers - a.activeUsers);
          this.activeUsersByCountry = this.activeUsersByCountry.slice(0, 5);

          this.activeUsersByCountry.forEach(item => {
            this.ranking.push(item.country.value);
          });
        }
      }
    ));
  }

  GetGoogleDeviceCategory() {
    this.VivaerosService.getDeviceCategories().then(order => order.subscribe(
      (data:any) => {
        if(data['rows'].length != 0) {
          this.activeUsersByDevice = data.rows.map(row => {
            return {
              device: row.dimensionValues[0].value,
              activeUsers: row.metricValues[0].value
            }
          });
          this.activeUsersByDevice.sort((a,b) => b.activeUsers - a.activeUsers);
          console.log(this.activeUsersByDevice);
        }
      }
    ));
  }

  /**
   * Initializes the Configdata and set a timer to fetch the data every few seconds, which is set as a configuration variable
   */
  InitiateConfigData() {

    //TODO: Exclude Weekends
    setInterval(() => {
      this.total = 0;
      this.GetOrderData();
      this.GetGoogleCountriesData();
      this.GetGoogleDeviceCategory();
      }, 1800000);
  }

}
