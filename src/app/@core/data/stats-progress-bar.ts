import { Observable } from 'rxjs';

export interface ProgressInfo {
  title: string;
  value: string;
  isCurrency: boolean;
  description: string;
}

export abstract class StatsProgressBarData {
  abstract getProgressInfoData(): Observable<ProgressInfo[]>;
}
