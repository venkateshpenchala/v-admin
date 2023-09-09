import { AfterViewInit, Component, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as echarts from 'echarts';

@Component({
  selector: 'echarts-bar',
  template: `
    <div echarts [options]="options" id="barChart" class="echart" style="height: 426px;"></div>
  `,
})
export class VivaerosBarComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  barChart: echarts.ECharts;

  constructor(private theme: NbThemeService) {
  }

  @Input() barChartData;

  ngAfterViewInit() {
    let chartElement = document.getElementById('barChart');
    this.barChart = echarts.init(chartElement);

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: ['Va Original', 'Va Mature', 'Va P'],
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: 'Order Value',
            type: 'bar',
            barWidth: '60%',
            data: this.barChartData,
            label: {
              show: true,
              position: 'inside'
            },
            itemStyle: {
              color: function(params) {
                var colorList = ['#000', '#FF0000', '#5A5A5A'];
                return colorList[params.dataIndex];
              }
            }
          },
        ],
      };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.barChart != undefined) {
      this.barChart.setOption({
        series:[
          {
            data: this.barChartData
          }
        ]
      }, false);
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
