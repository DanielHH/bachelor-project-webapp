import { Card } from './card';
import { Document } from './Document';
import { CardDetailComponent } from '../pages/cards/components/card-detail/card-detail.component';


/**
 * A BaseItem can be either a Card or a Document.
*/
export class BaseItem {
private static CARD_NAME = 'card';
private static DOCUMENT_NAME = 'document';

item: Card|Document;
itemType: string;

constructor(item: Card|Document, itemType: string) {
  this.item = item;
  this.itemType = itemType;
  if (itemType !== BaseItem.CARD_NAME && itemType !== BaseItem.DOCUMENT_NAME) {
    console.error('invalid baseitem type');
  }
}

getSubType(): number {
  if (this.itemType === BaseItem.CARD_NAME) {
    return (this.item as Card).cardType;
  } else {
    return (this.item as Document).documentType;
  }
}

/**
 * Get the unique serial number for this item.
*/
getNumber(): string {
  if (this.itemType === BaseItem.CARD_NAME) {
    return (this.item as Card).cardNumber;
  } else {
    return (this.item as Document).documentNumber;
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

/**
 * Type checking using instanceof can break as the Cards/Documents can lose
 * their types (but still keep their exact structures and still be accepted by type-restricted functions)
 * as the objects are passed through pipes (?), so type checking is done this way instead.
*/
isCard(): boolean {
  return this.itemType === BaseItem.CARD_NAME;
}

isDocument(): boolean {
  return this.itemType === BaseItem.DOCUMENT_NAME;
}

}
