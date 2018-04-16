import { Component, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../datamodels/card';
import { Receipt } from '../../datamodels/receipt';
import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';

import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { LogEvent } from '../../datamodels/logEvent';
import { RouteDataService } from '../../services/route-data.service';

@Component({
  selector: 'app-cardhistory',
  templateUrl: './cardhistory.component.html',
  styleUrls: ['./cardhistory.component.scss']
})
export class CardhistoryComponent implements OnInit {

  logEventList: LogEvent[] = [];

  card: Card;

  constructor(public dataService: DataService, private routeDataService: RouteDataService) {
    this.routeDataService.card.subscribe((card) => {
      this.card = card;
    });
    this.dataService.logEventList.subscribe((logEventList) => {
      this.logEventList = logEventList; //_.filter(logEventList, (logEvent) => (logEvent.card.id  == this.card.id))
    });

  }

  ngOnInit() {
  }

}
