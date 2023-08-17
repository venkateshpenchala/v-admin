import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'echarts-pie',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})

export class VivaerosPieComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
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
        title: {
          text: `800 €`,
          fontSize: 80,
          left: 'center',
          top: 'center',
          textStyle: {
              color: echarts.textColor
          }
        },
        series: [
          {
            name: 'Countries',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            data: [
              { value: 335, name: 'Va Original' },
              { value: 310, name: 'Va Mature' },
              { value: 234, name: 'Va P' }
            ],
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
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
