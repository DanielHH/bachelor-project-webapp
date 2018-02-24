import { Component, OnInit } from '@angular/core';
import { Card } from '../../datamodels/card';
import { AddNewCardComponent } from './components/add-new-card/add-new-card.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddNewCardComponent, {
      width: '600px'
    });
  }

}
