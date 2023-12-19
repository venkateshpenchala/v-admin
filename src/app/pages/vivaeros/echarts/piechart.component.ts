import { AfterViewInit, Component, Input, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as echarts from 'echarts';

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
    this.theme.onMediaQueryChange().subscribe(value => {
      const currentWidth = value[1].width;
      if (currentWidth >= 1200) {
        this.isMobileView = false;
        this.fontSize = '80';
        this.arrowHeight = 100;
        this.arrowWidth = 100;
        this.arrowTop = '400';
      } else {
        this.isMobileView = true;
        this.fontSize = '40';
        this.arrowHeight = 50;
        this.arrowWidth = 50;
        this.arrowTop = '370';
      }
    });
  }

  @Input() sum:number;
  @Input() chartData;
  @Input() status;
  isMobileView: boolean;
  fontSize: string;
  arrowWidth: number;
  arrowHeight: number;
  arrowTop: string;

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
          left: 'left',
          textStyle: {
            fontSize: 14,
            color: echarts.textColor
          },
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
              fontSize: this.fontSize,
              fontWeight: 'bold',
              formatter: () => {
                return this.sum + '€'; // Use sum variable here
              },
              color: echarts.textColor
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold'
              }
            }
          }
        ]
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

    if(changes.status && changes.status.currentValue) {
      let imgSrc = '';
      if(changes.status.currentValue == 'Better') {
        imgSrc = 'assets/images/chartup.png';
      } else {
        imgSrc = 'assets/images/chartdown.png';
      }

      this.myChart.setOption({
        graphic: {
          type: 'image',
          id: 'logo',
          left: 'center',
          top: '370',
          z: 10,
          bounding: 'raw',
          origin: [0, 75],
          style: {
            image: imgSrc, // your image or icon URL here
            width: this.arrowWidth,
            height: this.arrowHeight
          }
        }
      }, false);
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
