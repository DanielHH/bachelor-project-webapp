import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Receipt } from '../datamodels/receipt';
import { UtilitiesService, lowerCase } from '../services/utilities.service';

@Pipe({
  name: 'matchFilterReceipt'
})
export class MatchFilterReceiptPipe implements PipeTransform {
  constructor(private utilitiesService: UtilitiesService) {}

  transform(
    value: Receipt[],
    input: string,
    showCard: boolean,
    showDocument: boolean,
    showActive: boolean,
    showInactive: boolean
  ): Receipt[] {
    return _.filter(value, receipt => {
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
      receipt == null ||
      !receipt.id ||
      (receipt.endDate == null && !showActive) ||
      (receipt.endDate != null && !showInactive) ||
      (receipt.itemType.id == 1 && !showCard) ||
      (receipt.itemType.id == 2 && !showDocument)
    ) {
      return false;
    }

    filterInput = lowerCase(filterInput);
    const startDate = this.utilitiesService.getDateString(receipt.startDate);
    const endDate = this.utilitiesService.getDateString(receipt.endDate);

    let itemTypeToDisplay = '';
    let itemIDToDisplay = '';

    if (receipt.card) {
      itemTypeToDisplay = receipt.card.cardType.name;
      itemIDToDisplay = receipt.card.cardNumber;
    } else if (receipt.document) {
      itemTypeToDisplay = receipt.document.documentType.name;
      itemIDToDisplay = receipt.document.documentNumber;
    }

    return (
      _.includes(lowerCase(itemTypeToDisplay), filterInput) === true ||
      _.includes(lowerCase(itemIDToDisplay), filterInput) === true ||
      _.includes(lowerCase(this.utilitiesService.getUserString(receipt.user)), filterInput) === true ||
      _.includes(lowerCase(startDate), filterInput) === true ||
      _.includes(lowerCase(endDate), filterInput) === true
    );
  }
}
