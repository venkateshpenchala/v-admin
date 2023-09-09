import { AfterViewInit, Component, Input, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as echarts from 'echarts';
import { Vivaeros } from '../models/vivaeros';

@Component({
  selector: 'echarts-pie',
  template: `
    <div echarts #piechart [options]="options" id="pieChart" class="echart" style="height: 700px;" ></div>
  `,
})

export class VivaerosPieComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  myChart: echarts.ECharts;

  constructor(private theme: NbThemeService) {
  }

  @Input() sum:number;
  @Input() chartData;

  ngAfterViewInit() {
    let chartElement = document.getElementById('pieChart');
    this.myChart = echarts.init(chartElement);

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.successLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Vivaeros',
            type: 'pie',
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            data: this.chartData,
            color: ['#000', '#FF0000', '#5A5A5A'],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'center',
              fontSize: '80',
              fontWeight:'bold',
              formatter: () => {
                return this.sum+ '€'; // Use sum variable here
              },
              color: echarts.textColor
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
          },
        ],
      };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.sum && changes.sum.currentValue) {
      this.myChart.setOption({
        series: [
          {
            data: this.chartData
          }
        ]
      }, false);
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
