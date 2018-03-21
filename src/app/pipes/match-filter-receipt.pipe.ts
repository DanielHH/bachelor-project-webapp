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

  cardList: Card[] = [];
  documentList: Document[] = [];
  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  itemTypeToDisplay: string;
  itemIDToDisplay: string;
  itemUserNameToDisplay: string;

  constructor(private utilitiesService: UtilitiesService) { 
  }

  transform(value: Receipt[], input: string, showCard: boolean, showDocument: boolean, showActive: boolean, showInactive: boolean): Receipt[] {
    return _.filter(value, (receipt) => {
      return this.matchFilt(receipt, input, showCard, showDocument, showActive, showInactive);
  });
  }

  matchFilt(receipt: Receipt, filterInput: string, showCard: boolean, showDocument: boolean, showActive: boolean, showInactive: boolean) {
    if( (receipt.endDate == null && !showActive) || (receipt.endDate != null && !showInactive) || 
        (receipt.itemTypeID == 1 && !showCard) || (receipt.itemTypeID == 2 && !showDocument) ){
      return false;
    }

    filterInput = lowerCase(filterInput);
    const startDate = moment(receipt.startDate).format('YYYY-MM-DD');
    const endDate = moment(receipt.endDate).format('YYYY-MM-DD');

    [this.itemIDToDisplay, this.itemTypeToDisplay, this.itemUserNameToDisplay] =
      this.utilitiesService.getReceiptDisplay(receipt);

    if (_.includes(lowerCase(this.itemTypeToDisplay), filterInput) === false
    && (_.includes(lowerCase(this.itemIDToDisplay), filterInput) === false)
    && (_.includes(lowerCase(this.itemUserNameToDisplay), filterInput) === false)
    && (_.includes(lowerCase(startDate), filterInput) === false)
    && (_.includes(lowerCase(endDate), filterInput) === false) ) {
      return false;
    }
    
    return true;
  }

}
