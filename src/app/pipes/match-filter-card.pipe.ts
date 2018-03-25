import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../datamodels/card';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DataService } from '../services/data.service';
import { User } from '../datamodels/user';
import { CardType } from '../datamodels/cardType';
import { lowerCase, UtilitiesService } from '../services/utilities.service';

@Pipe({
  name: 'matchFilterCard'
})

export class MatchFilterCardPipe implements PipeTransform {

  cardTypeList: CardType[] = [];
  userList: User[] = [];

  constructor(
    public dataService: DataService,
    private utilitiesService: UtilitiesService
  ) {
    this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });

    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  transform(value: Card[], input: string, showIn: boolean, showOut: boolean, showArchived: boolean, showGone: boolean): Card[] {
    return _.filter(value, (card) => {
        return this.matchFilt(card, input, showIn, showOut, showArchived, showGone);
    });
  }

  /**
   * Match filterInput to the various displayed fields of card
   * @param card
   * @param filterInput
   * @param showIn true if checkbox showIn checked
   * @param showOut true if checkbox showOut checked
   * @param showArchived true if checkbox showArchived checked
   * @param showGone true if checkbox showGone checked
   * @returns True if match found
   */
  matchFilt(card: Card, filterInput: string, showIn: boolean, showOut: boolean, showArchived: boolean, showGone: boolean) {

    const cardTypeString = this.utilitiesService.getCardTypeString(card.cardType);
    const userString = this.utilitiesService.getUserString(card.userID);

    if (
      (card.status == 1 && !showIn) ||
      (card.status == 2 && !showOut) ||
      (card.status == 3 && !showArchived) ||
      (card.status == 4 && !showGone)
    ) {
      return false;
    }

    filterInput = lowerCase(filterInput);
    const displayDate = this.utilitiesService.getDateString(card.expirationDate);

    if (
      (_.includes('kort', filterInput) === false) &&
      (_.includes(lowerCase(card.cardNumber), filterInput) === false) &&
      (_.includes(lowerCase(cardTypeString), filterInput) === false) &&
      (_.includes(lowerCase(userString), filterInput) === false) &&
      (_.includes(lowerCase(card.comment), filterInput) === false) &&
      (_.includes(lowerCase(card.location), filterInput) === false) &&
      (_.includes(lowerCase(displayDate), filterInput) === false)
    ) {
      return false;
    }
    return true;
  }

}
