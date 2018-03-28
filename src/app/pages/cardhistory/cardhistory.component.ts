import { Component, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../datamodels/card';
import { Receipt } from '../../datamodels/receipt';
import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';

import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { LogEvent } from '../../datamodels/logEvent';

@Component({
  selector: 'app-cardhistory',
  templateUrl: './cardhistory.component.html',
  styleUrls: ['./cardhistory.component.scss']
})
export class CardhistoryComponent implements OnInit {

  logEventList: LogEvent[] = [];

  constructor(public dataService: DataService) {

    this.dataService.logEventList.subscribe((logEventList) => {
      this.logEventList = logEventList;
    });

  }

  ngOnInit() {
  }

}
