import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { ProgressInfo, StatsProgressBarData } from '../data/stats-progress-bar';

@Injectable()
export class StatsProgressBarService extends StatsProgressBarData {
  private progressInfoData: ProgressInfo[] = [
    {
      title: 'Today’s Profit',
      value: 800,
      activeProgress: 70,
      description: 'Better than last week (70%)',
    },
    {
      title: 'This month Forecast',
      value: 6378,
      activeProgress: 30,
      description: 'Better than last week (30%)',
    }
  ];

  getProgressInfoData(): Observable<ProgressInfo[]> {
    return observableOf(this.progressInfoData);
  }
}
