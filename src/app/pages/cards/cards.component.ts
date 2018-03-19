import { Component, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../datamodels/card';
import { ModifyCardComponent } from './components/modify-card/modify-card.component';
import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';

import * as _ from 'lodash';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  cardList: Card[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardList.subscribe((cardList) => {
      this.cardList = cardList;
    });

  }

  ngOnInit() {
  }

}
