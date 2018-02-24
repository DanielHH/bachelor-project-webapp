import { Component, OnInit } from '@angular/core';
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

  ngOnInit() {
  }

  constructor(public dataService: DataService, public dialog: MatDialog) {

    this.dataService.cardList.subscribe( (cardList) => {
    });

  }

  openDialog() {
    const dialogRef = this.dialog.open(AddNewCardComponent, {
      width: '600px'
    });
  }



}
