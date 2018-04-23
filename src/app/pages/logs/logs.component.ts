import { Component, OnInit } from '@angular/core';
import { LogEvent } from '../../datamodels/logEvent';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logEventList: LogEvent[] = [];

  constructor(public dataService: DataService) {
    this.dataService.logEventList.subscribe(logEventList => {
      this.logEventList = logEventList;
    });
  }

  ngOnInit() {}
}
