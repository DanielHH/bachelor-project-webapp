import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';
import { DocumentType } from '../datamodels/documentType';
import { Delivery } from '../datamodels/delivery';
import { lowerCase, UtilitiesService } from '../services/utilities.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Pipe({
  name: 'matchFilterDelivery'
})

export class MatchFilterDeliveryPipe implements PipeTransform {

  constructor(public dataService: DataService,
    private utilitiesService: UtilitiesService) { }

  transform(value: Delivery[], input: string, showActive: boolean, showArchived: boolean, showGone: boolean): Delivery[] {
    return _.filter(value, (delivery) => {
      return this.matchFilt(delivery, input, showActive, showArchived, showGone);
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
  matchFilt(delivery: Delivery, filterInput: string, showActive: boolean, showArchived: boolean, showGone: boolean) {

    if (
      (!delivery) ||
      (!delivery.id) ||
      (delivery.status.id == 1 && !showActive) ||
      (delivery.status.id == 2 && !showActive) ||
      (delivery.status.id == 3 && !showArchived) ||
      (delivery.status.id == 4 && !showGone)
    ) {
      return false;
    }

    const sentDate = moment(delivery.sentDate).format('YYYY-MM-DD');
    filterInput = lowerCase(filterInput);

    if (_.includes(lowerCase(delivery.documentType.name), filterInput) === false
    && (_.includes(lowerCase(delivery.documentNumber), filterInput) === false)
    && (_.includes(lowerCase(delivery.name), filterInput) === false)
    && (_.includes(lowerCase(delivery.receiver), filterInput) === false)
    && (_.includes(lowerCase(this.utilitiesService.getDateString(delivery.sentDate)), filterInput) === false)
    && (_.includes(lowerCase(delivery.comment), filterInput) === false) ) {
      return false;
    }
    return true;
  }

}
