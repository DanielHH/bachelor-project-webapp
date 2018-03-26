import { Component, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../datamodels/card';
import { Receipt } from '../../datamodels/receipt';
import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';

import * as _ from 'lodash';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cardhistory',
  templateUrl: './cardhistory.component.html',
  styleUrls: ['./cardhistory.component.scss']
})
export class CardhistoryComponent implements OnInit {

  receiptList: Receipt[] = [];

  constructor(public dataService: DataService) {
    this.dataService.receiptList.subscribe((receiptList) => {
      this.receiptList = receiptList;
    });

  }

  ngOnInit() {
  }

}
