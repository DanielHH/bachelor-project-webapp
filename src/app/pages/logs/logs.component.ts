import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogEvent } from '../../datamodels/logEvent';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  logEventList: LogEvent[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.logEventList.subscribe(logEventList => {
      this.logEventList = logEventList;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
