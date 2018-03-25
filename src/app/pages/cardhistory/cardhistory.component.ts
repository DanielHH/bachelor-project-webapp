import { Component, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../datamodels/card';
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

  cardList: Card[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardList.subscribe((cardList) => {
      this.cardList = cardList;
    });

  }

  ngOnInit() {
  }

}
