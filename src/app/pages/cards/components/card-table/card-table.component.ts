import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import * as moment from 'moment';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

  @Input() cardList: Card[];

  filterInput = '';
  sortAscendingCardType = true;
  sortAscendingCardNumber = true;
  sortAscendingUserID = true;
  sortAscendingLocation = true;
  sortAscendingComment = true;
  sortAscendingDate = true;
  sortedCardType = false;
  sortedCardNumber = false;
  sortedUserID = false;
  sortedLocation = false;
  sortedComment = false;
  sortedDate = false;

  constructor() { }

  ngOnInit() {
  }

  sortCardType() {
    this.sortedCardType = true;
    this.cardList.sort(function(a, b) {return a.cardType - b.cardType; });
    if (this.sortAscendingCardType) {
      this.sortAscendingCardType = false;
    } else {
      this.cardList.reverse();
      this.sortAscendingCardType = true;
    }
  }

  sortCardNumber() {
    this.sortedCardNumber = true;
    this.cardList.sort(this.sortCardNumberHelper);
    if (this.sortAscendingCardNumber) {
      this.sortAscendingCardNumber = false;
    } else {
      this.cardList.reverse();
      this.sortAscendingCardNumber = true;
    }
  }

  sortLocation() {
    this.sortedLocation = true;
    this.cardList.sort(this.sortLocationHelper);
    if (this.sortAscendingLocation) {
      this.sortAscendingLocation = false;
    } else {
      this.cardList.reverse();
      this.sortAscendingLocation = true;
    }
  }

  sortComment() {
    this.sortedComment = true;
    this.cardList.sort(this.sortCommentHelper);
    if (this.sortAscendingComment) {
      this.sortAscendingComment = false;
    } else {
      this.cardList.reverse();
      this.sortAscendingComment = true;
    }
  }

  sortDate() {
    this.sortedDate = true;
    this.cardList.sort(this.sortDateHelper);
    if (this.sortAscendingDate) {
      this.sortAscendingDate = false;
    } else {
      this.cardList.reverse();
      this.sortAscendingDate = true;
    }
  }

  sortLocationHelper(a: Card, b: Card) {
    if (a.location < b.location) {
      return -1;
    } else if (a.location > b.location) {
      return 1;
    } else {
      return 0;
    }
  }

  sortCardNumberHelper(a: Card, b: Card) {
    if (a.cardNumber < b.cardNumber) {
      return -1;
    } else if (a.cardNumber > b.cardNumber) {
      return 1;
    } else {
      return 0;
    }
  }

  sortCommentHelper(a: Card, b: Card) {
    if (a.comment < b.comment) {
      return -1;
    } else if (a.comment > b.comment) {
      return 1;
    } else {
      return 0;
    }
  }

  sortDateHelper(a: Card, b: Card) {
    if (a.displayedDate < b.displayedDate) {
      return -1;
    } else if (a.displayedDate > b.displayedDate) {
      return 1;
    } else {
      return 0;
    }
  }

}
