import { Observable } from 'rxjs';

export interface ProgressInfo {
  title: string;
  value: string;
  style: object;
  isCurrency: boolean;
  description: string;
}

export abstract class StatsProgressBarData {
  abstract getProgressInfoData(): Observable<ProgressInfo[]>;
}
