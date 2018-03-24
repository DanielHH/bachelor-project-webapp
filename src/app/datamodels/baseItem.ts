import { Card } from './card';
import { Document } from './Document';
import { CardDetailComponent } from '../pages/cards/components/card-detail/card-detail.component';

/**
 * A BaseItem can be either a Card or a Document.
*/
export class BaseItem {
itemType: string;
item: Card|Document;

constructor(item: Card|Document, itemType: string) {
  if (itemType !== 'card' && itemType !== 'document') {
    console.error('Only document or card may be passed as type argument to BaseItem');
    return;
  }
  this.itemType = itemType;
  this.item = item;
}

getType(): string {
  return this.itemType;
}

getInnerType(): string {
  return;
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

}
