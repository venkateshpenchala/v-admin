import { Observable } from 'rxjs';

export interface ProgressInfo {
  title: string;
  value: number;
  isCurrency: boolean;
  description: string;
}

export abstract class StatsProgressBarData {
  abstract getProgressInfoData(): Observable<ProgressInfo[]>;
}
