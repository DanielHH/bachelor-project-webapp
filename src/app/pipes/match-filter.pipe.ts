import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../datamodels/card';
import * as _ from 'lodash';

@Pipe({
  name: 'matchFilter'
})

export class MatchFilterPipe implements PipeTransform {

  transform(value: Card[], input: string): Card[] {
    if (input !== '') {
      return _.filter(value, (card) => {
        return this.matchFilt(card, input);
      });
    }
    return value;
  }

  matchFilt(card: Card, filterInput: string) {
    filterInput = _.lowerCase(filterInput);

    if (_.includes(_.lowerCase(card.cardNumber), filterInput) === false
    && (_.includes(_.lowerCase(_.toString(card.cardType)), filterInput) === false)
    && (_.includes(_.lowerCase(_.toString(card.userID)), filterInput) === false)
    && (_.includes(_.lowerCase(card.comment), filterInput) === false)
    && (_.includes(_.lowerCase(card.location), filterInput) === false)
    && (_.includes(_.lowerCase(card.displayedDate), filterInput) === false) ) {
      return false;
    }
    return true;
  }

}
