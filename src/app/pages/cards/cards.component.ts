import { Component, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../datamodels/card';
import { AddNewCardComponent } from './components/add-new-card/add-new-card.component';
import {MatDialog} from '@angular/material';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  cardList: Card[] = [];

  showAddNewModal = false;

  @ViewChild(AddNewCardComponent) addNewCard: AddNewCardComponent;

  constructor(public dataService: DataService, public dialog: MatDialog) {
    this.dataService.cardList.subscribe( (cardList) => {
      this.cardList = cardList;
    });

  }

  ngOnInit() {
  }

}
