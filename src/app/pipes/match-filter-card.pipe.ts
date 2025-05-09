import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Card } from '../datamodels/card';
import { UtilitiesService, lowerCase } from '../services/utilities.service';

@Pipe({
  name: 'matchFilterCard'
})
export class MatchFilterCardPipe implements PipeTransform {
  constructor(private utilitiesService: UtilitiesService) {}

  transform(
    value: Card[],
    input: string,
    showIn: boolean,
    showOut: boolean,
    showArchived: boolean,
    showGone: boolean
  ): Card[] {
    return _.filter(value, card => {
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
  matchFilt(
    card: Card,
    filterInput: string,
    showIn: boolean,
    showOut: boolean,
    showArchived: boolean,
    showGone: boolean
  ) {
    if (
      !card ||
      !card.id ||
      (card.status.id == 1 && !showIn) ||
      (card.status.id == 2 && !showOut) ||
      (card.status.id == 3 && !showArchived) ||
      (card.status.id == 4 && !showGone)
    ) {
      return false;
    }

    filterInput = lowerCase(filterInput);

    return (
      _.includes(lowerCase(card.cardNumber), filterInput) === true ||
      _.includes(lowerCase(card.cardType.name), filterInput) === true ||
      _.includes(lowerCase(this.utilitiesService.getUserString(card.user)), filterInput) === true ||
      _.includes(lowerCase(card.comment), filterInput) === true ||
      _.includes(lowerCase(card.location), filterInput) === true ||
      _.includes(lowerCase(this.utilitiesService.getDateString(card.expirationDate)), filterInput) === true
    );
  }
}
