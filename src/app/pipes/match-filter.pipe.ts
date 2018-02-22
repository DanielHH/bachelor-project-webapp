import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../datamodels/card';
import * as _ from 'lodash';

@Pipe({
  name: 'matchFilter'
})
export class MatchFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return _.filter(value, (card) => {
      return this.matchFilt(card, args);
    });
  }

  matchFilt(card: Card, filterInput: string) {
    if (card.cardNumber.indexOf(filterInput) === -1
        && card.cardType.toString().indexOf(filterInput) === -1
        && card.userID.toString().indexOf(filterInput) === -1
        && card.comment.indexOf(filterInput) === -1
        && card.location.indexOf(filterInput) === -1
        && card.displayedDate.indexOf(filterInput) === -1) {
      return false;
    }
    return true;
  }

}
