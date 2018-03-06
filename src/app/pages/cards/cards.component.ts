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
  editCard: Card = null; // Card to be edited

  showAddNewModal = false;

  showEditModal = false;

  @ViewChild(ModifyCardComponent) addNewCardComponent: ModifyCardComponent;

  @ViewChild(ModifyCardComponent) editCardComponent: ModifyCardComponent;

  @ViewChild('addNewCardForm') addNewCardForm: NgForm;

  @ViewChild('editCardForm') editCardForm: NgForm;

  constructor(public dataService: DataService) {
    this.dataService.cardList.subscribe((cardList) => {
      this.cardList = cardList;
    });

  }

  ngOnInit() {
  }

  setEditCard(card: any) {
    this.editCard = card;
    this.showEditModal = true;
  }

  submitNewCard() {
    this.addNewCardComponent.addNewCard().then(() => {
      this.showAddNewModal = false;
      this.addNewCardForm.resetForm();
    });
  }

  submitEditCard() {
    this.editCardComponent.editCard(this.editCard).then(() => {
      this.showEditModal = false;
      this.editCardForm.resetForm();
    });
  }

}
