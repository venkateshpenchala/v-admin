import { NgModule } from "@angular/core";
import { ThemeModule } from "../../@theme/theme.module";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ChartModule } from "angular2-chartjs";
import { NbCardModule } from "@nebular/theme";
import { VivaerosPieComponent } from "./echarts/piechart.component";
import { VivaerosDashboardComponent } from "./vivaeros.component";
import { VivaerosBarComponent } from "./echarts/barchart.component";


const components = [
  VivaerosPieComponent,
  VivaerosDashboardComponent,
  VivaerosBarComponent
];

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
  ],
  declarations: [ ...components],
})
export class VivaerosModule {}
