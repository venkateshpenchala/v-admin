import { Component, OnDestroy } from "@angular/core";
import { ProgressInfo } from "../../@core/data/stats-progress-bar";

@Component({
  selector: 'vivaeros-dashboard',
  styleUrls: ['./vivaeros.component.scss'],
  templateUrl: './vivaeros.component.html',
})
export class VivaerosDashboardComponent implements OnDestroy {

  progressInfoData: ProgressInfo[] = [
    {
      title: 'Today’s Profit',
      value: 800,
      isCurrency: true,
      description: 'Better than last week (70%)',
    },
    {
      title: 'This month Forecast',
      value: 6378,
      isCurrency: true,
      description: 'Better than last week (30%)',
    }
  ];

  webhits: ProgressInfo[] = [
    {
      title: 'Today’s Web hits',
      value: 1020,
      isCurrency: false,
      description: '',
    },
    {
      title: 'This month Web hits',
      value: 12000,
      isCurrency: false,
      description: '',
    }
  ];


  ngOnDestroy(): void {
  }
}
