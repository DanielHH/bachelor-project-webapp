import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';
import { DocumentType } from '../datamodels/documentType';
import { Delivery } from '../datamodels/delivery';
import { lowerCase } from '../services/utilities.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Pipe({
  name: 'matchFilterDelivery'
})
export class MatchFilterDeliveryPipe implements PipeTransform {

  documentTypeList: DocumentType[] = [];

  constructor(public dataService: DataService) {
    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });
  }


  transform(value: Delivery[], input: string, showIn: boolean, showOut: boolean, showArchived: boolean, showGone: boolean): Delivery[] {
    return _.filter(value, (delivery) => {
      return this.matchFilt(delivery, input, showIn, showOut, showArchived, showGone);
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
  matchFilt(delivery: Delivery, filterInput: string, showIn: boolean, showOut: boolean, showArchived: boolean, showGone: boolean) {

    const sentDate = moment(delivery.sentDate).format('YYYY-MM-DD');
    filterInput = lowerCase(filterInput);

    // tslint:disable-next-line:triple-equals
    if ( (delivery.status == 1 && !showIn) || (delivery.status == 2 && !showOut) ||
    // tslint:disable-next-line:triple-equals
    (delivery.status == 3 && !showArchived) || (delivery.status == 4 && !showGone) ) {
      return false;
    }

    if (_.includes(lowerCase(this.getDocumentType(delivery)), filterInput) === false
    && (_.includes(lowerCase(delivery.documentNumber), filterInput) === false)
    && (_.includes(lowerCase(delivery.name), filterInput) === false)
    && (_.includes(lowerCase(delivery.receiver), filterInput) === false)
    && (_.includes(lowerCase(sentDate), filterInput) === false)
    && (_.includes(lowerCase(delivery.comment), filterInput) === false) ) {
      return false;
    }
    return true;
  }

   /**
   * Gets the document type for a document
   * @param document
   * @returns The corresponding type of document
   */
  getDocumentType(delivery: Delivery) {
    if (delivery.documentType > 0) {
      const documentTypeToDisplay = _.find( this.documentTypeList, documentType => documentType.id === delivery.documentType);
      if (documentTypeToDisplay) {
        return documentTypeToDisplay.name;
      }
    }
    return '';
  }

}
