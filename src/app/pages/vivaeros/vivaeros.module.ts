import { NgModule } from "@angular/core";
import { ThemeModule } from "../../@theme/theme.module";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ChartModule } from "angular2-chartjs";
import { NbCardModule, NbListModule } from "@nebular/theme";
import { VivaerosPieComponent } from "./echarts/piechart.component";
import { VivaerosDashboardComponent } from "./vivaeros.component";
import { VivaerosBarComponent } from "./echarts/barchart.component";
import { VivaerosCountryOrdersComponent } from "./country-orders/country-orders.component";
import { VivaerosProgressSectionComponent } from "./progress-section/progress-section.component";
import { VivaerosCountryOrdersChartComponent } from "./country-orders/chart/country-orders-chart.component";
import { VivaerosCountryOrdersMapComponent } from "./country-orders/map/country-orders-map.component";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { VivaerosCountryOrdersMapService } from "./country-orders/map/country-orders-map.service";


const components = [
  VivaerosPieComponent,
  VivaerosDashboardComponent,
  VivaerosBarComponent,
  VivaerosCountryOrdersComponent,
  VivaerosProgressSectionComponent,
  VivaerosCountryOrdersChartComponent,
  VivaerosCountryOrdersMapComponent
];

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
    NbListModule,
    LeafletModule
  ],
  declarations: [ ...components],
  providers: [
    VivaerosCountryOrdersMapService
  ]
})
export class VivaerosModule {}
