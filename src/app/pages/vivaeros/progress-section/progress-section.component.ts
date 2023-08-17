import { Component, Input, OnDestroy } from '@angular/core';
import { ProgressInfo, StatsProgressBarData } from '../../../@core/data/stats-progress-bar';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-progress-section',
  styleUrls: ['./progress-section.component.scss'],
  templateUrl: './progress-section.component.html',
})
export class VivaerosProgressSectionComponent implements OnDestroy {

  private alive = true;

  @Input() progressInfoData: ProgressInfo[];

  constructor() {
  }

  ngOnDestroy() {
    this.alive = true;
  }
}
