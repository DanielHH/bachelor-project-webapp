import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Document } from '../../datamodels/document';
import { LogEvent } from '../../datamodels/logEvent';
import { DataService } from '../../services/data.service';
import { RouteDataService } from '../../services/route-data.service';



@Component({
  selector: 'app-document-history',
  templateUrl: './document-history.component.html',
  styleUrls: ['./document-history.component.scss']
})
export class DocumentHistoryComponent implements OnInit {
  logEventList: LogEvent[] = [];
  filteredLogEventList: LogEvent[] = [];
  document: Document;

  constructor(public dataService: DataService, private routeDataService: RouteDataService) {
    this.routeDataService.document.subscribe(document => {
      this.document = document;
      if (this.logEventList) {
        this.filteredLogEventList = _.filter(this.logEventList, logEvent => {
          if (logEvent.document && logEvent.document.id) {
            return logEvent.document.id == this.document.id;
          }
          return false;
        });
      }
    });
    this.dataService.logEventList.subscribe(logEventList => {
      this.logEventList = logEventList;
      if (this.document && this.document.id) {
        this.filteredLogEventList = _.filter(this.logEventList, logEvent => {
          if (logEvent.document && logEvent.document.id) {
            return logEvent.document.id == this.document.id;
          }
          return false;
        });
      }
    });
  }
  ngOnInit() {}
}
