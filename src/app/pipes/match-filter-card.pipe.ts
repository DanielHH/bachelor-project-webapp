import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../datamodels/card';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DataService } from '../services/data.service';
import { User } from '../datamodels/user';
import { CardType } from '../datamodels/cardType';
import { lowerCase } from '../services/utilities.service';

@Pipe({
  name: 'matchFilterCard'
})

export class MatchFilterCardPipe implements PipeTransform {

  cardTypeList: CardType[] = [];
  userList: User[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }


  transform(value: Card[], input: string): Card[] {
    if (input !== '') {
      return _.filter(value, (card) => {
        return this.matchFilt(card, input);
      });
    }
    return value;
  }

  matchFilt(card: Card, filterInput: string) {
    filterInput = lowerCase(filterInput);
    const displayDate = moment(card.expirationDate).format('YYYY-MM-DD');

    if (_.includes(lowerCase(card.cardNumber), filterInput) === false
    && (_.includes(lowerCase(this.getCardType(card)), filterInput) === false)
    && (_.includes(lowerCase(this.getUserName(card)), filterInput) === false)
    && (_.includes(lowerCase(card.comment), filterInput) === false)
    && (_.includes(lowerCase(card.location), filterInput) === false)
    && (_.includes(lowerCase(displayDate), filterInput) === false) ) {
      return false;
    }
    return true;
  }

  getCardType(card: Card) {
    if (card.cardType > 0) {
      const cardTypeToDisplay = _.find( this.cardTypeList, cardType => cardType.id === card.cardType);
      if (cardTypeToDisplay) {
        return cardTypeToDisplay.name;
      }
    }
    return '';
  }

  getUserName(card: Card) {
    if (card.userID > 0) {
      const userToDisplay = _.find( this.userList, user => user.id === card.userID);
      if (userToDisplay) {
        return userToDisplay.name;
      }
    }
    return '';
  }

}
