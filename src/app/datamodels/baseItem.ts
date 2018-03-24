import { Card } from './card';
import { Document } from './Document';
import { CardDetailComponent } from '../pages/cards/components/card-detail/card-detail.component';

/**
 * A BaseItem can be either a Card or a Document.
*/
export class BaseItem {
item: Card|Document;

constructor(item: Card|Document) {
  this.item = item;
}

getName(): string {
  if (this.item instanceof Card) {
    return 'Kort';
  } else {
    return 'Handling';
  }
}

getType(): number {
  if (this.item instanceof Card) {
    return this.item.cardType;
  } else {
    return this.item.documentType;
  }
}

/**
 * Get the unique serial number for this item.
*/
getNumber(): string {
  if (this.item instanceof Card) {
    return this.item.cardNumber;
  } else {
    return this.item.documentNumber;
  }
}

getUserID(): number {
  return this.item.userID;
}

getLocation(): string {
  return this.item.location;
}

getComment(): string {
  return this.item.comment;
}

getStatus(): number {
  return this.item.status;
}

}
