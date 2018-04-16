import { Component, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../datamodels/card';
import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data.service';

import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { LogEvent } from '../../datamodels/logEvent';
import { RouteDataService } from '../../services/route-data.service';

@Component({
  selector: 'app-cardhistory',
  templateUrl: './cardhistory.component.html',
  styleUrls: ['./cardhistory.component.scss']
})
export class CardHistoryComponent implements OnInit {

  logEventList: LogEvent[] = [];
  filteredLogEventList: LogEvent[] = [];
  card: Card;

  constructor(public dataService: DataService, private routeDataService: RouteDataService) {
    this.routeDataService.card.subscribe((card) => {
      this.card = card;
      if (this.logEventList) {
        this.filteredLogEventList = _.filter(this.logEventList, (logEvent) => (logEvent.card.id  == this.card.id));
      }
    });
    this.dataService.logEventList.subscribe((logEventList) =>  {
      this.logEventList = logEventList;
      if (this.card && this.card.id) {
        this.filteredLogEventList = _.filter(this.logEventList, (logEvent) => (logEvent.card.id  == this.card.id));
      }
    });
  }

  // this.logEventList = logEventList.filter(logEvent => logEvent.card.id == this.card.id);

  ngOnInit() {
  }

}
