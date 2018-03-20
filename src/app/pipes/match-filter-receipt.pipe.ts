import { Pipe, PipeTransform } from '@angular/core';
import { Receipt } from '../datamodels/receipt';

@Pipe({
  name: 'matchFilterReceipt'
})
export class MatchFilterReceiptPipe implements PipeTransform {

  transform(value: Receipt[], input: string, showCard: boolean, showDocument: boolean, showActive: boolean, showInactive: boolean): Receipt[] {
    return value;
  }

}
