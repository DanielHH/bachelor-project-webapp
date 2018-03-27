import { Pipe, PipeTransform } from '@angular/core';
import { Receipt } from '../datamodels/receipt';
import { Card } from '../datamodels/card';
import { CardType } from '../datamodels/cardType';
import { Document } from '../datamodels/document';
import { DocumentType } from '../datamodels/documentType';
import { User } from '../datamodels/user';
import { DataService } from '../services/data.service';
import * as _ from 'lodash';
import { lowerCase, UtilitiesService } from '../services/utilities.service';
import * as moment from 'moment';

@Pipe({
  name: 'matchFilterReceipt'
})
export class MatchFilterReceiptPipe implements PipeTransform {

  itemKindToDisplay: string;
  itemTypeToDisplay: string;
  itemIDToDisplay: string;
  itemUserNameToDisplay: string;

  constructor(private utilitiesService: UtilitiesService) {
  }

  transform(
    value: Receipt[],
    input: string,
    showCard: boolean,
    showDocument: boolean,
    showActive: boolean,
    showInactive: boolean
  ): Receipt[] {
    return _.filter(value, (receipt) => {
      return this.matchFilt(receipt, input, showCard, showDocument, showActive, showInactive);
  });
  }

    /**
   * Match filterInput to the various displayed fields of receipts
   * @param card
   * @param filterInput
   * @param showCard true if checkbox showCard checked
   * @param showDocument true if checkbox showDocument checked
   * @param showActive true if checkbox showActive checked
   * @param showInactive true if checkbox showInactive checked
   * @returns True if match found
   */
  matchFilt(
    receipt: Receipt,
    filterInput: string,
    showCard: boolean,
    showDocument: boolean,
    showActive: boolean,
    showInactive: boolean
  ) {

    if (
      (receipt == null) ||
      (!receipt.id) ||
      (receipt.endDate == null && !showActive) ||
      (receipt.endDate != null && !showInactive) ||
      (receipt.itemTypeID == 1 && !showCard) ||
      (receipt.itemTypeID == 2 && !showDocument)
    ) {
      return false;
    }

    filterInput = lowerCase(filterInput);
    const startDate = this.utilitiesService.getDateString(receipt.startDate);
    const endDate = this.utilitiesService.getDateString(receipt.endDate);

    [this.itemIDToDisplay, this.itemKindToDisplay, this.itemTypeToDisplay, this.itemUserNameToDisplay] =
      this.utilitiesService.getReceiptDisplay(receipt);

    return (
      (_.includes(lowerCase(this.itemKindToDisplay), filterInput) === true) ||
      (_.includes(lowerCase(this.itemTypeToDisplay), filterInput) === true) ||
      (_.includes(lowerCase(this.itemIDToDisplay), filterInput) === true) ||
      (_.includes(lowerCase(this.itemUserNameToDisplay), filterInput) === true) ||
      (_.includes(lowerCase(startDate), filterInput) === true) ||
      (_.includes(lowerCase(endDate), filterInput) === true)
    );
  }

}
