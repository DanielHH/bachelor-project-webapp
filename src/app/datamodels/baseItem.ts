import * as moment from 'moment';
import { Card } from './card';
import { CardType } from './cardType';
import { Document } from './document';
import { DocumentType } from './documentType';
import { ItemType } from './itemType';
import { StatusType } from './statusType';
import { User } from './user';

/**
 * A BaseItem can be either a Card or a Document.
 */
export class BaseItem {
  /**
   * The names identifying the item type.
   */
  private static CARD_NAME = 'card';
  private static DOCUMENT_NAME = 'document';

  /**
   * The Card or Document this BaseItem represents.
   */
  item: Card | Document;

  /**
   * The type of item this BaseItem represents.
   */
  itemType: string;

  /**
   * Returns true if this item is selected in the table
   */
  isChecked: boolean;

  constructor(item: Card | Document, itemType: string) {
    this.item = item;
    this.itemType = itemType;
    this.isChecked = false;
    if (itemType !== BaseItem.CARD_NAME && itemType !== BaseItem.DOCUMENT_NAME) {
      console.error('invalid baseitem type');
    }
  }

  /**
   * Get the card or document that this item represents
   */
  getItem(): any {
    if (this.isCard()) {
      return this.item as Card;
    } else {
      return this.item as Document;
    }
  }

  /**
   * Return the type of Card if this BaseItem represents a Card,
   * or the type of Document if this BaseItem represents a Document.
   */
  getSubType(): CardType | DocumentType {
    if (this.isCard()) {
      return (this.item as Card).cardType;
    } else {
      return (this.item as Document).documentType;
    }
  }

  /**
   * Get the card or document number for this item.
   */
  getNumber(): string {
    if (this.isCard()) {
      return (this.item as Card).cardNumber;
    } else {
      return (this.item as Document).documentNumber;
    }
  }

  /**
   * Get the user associated with this Card/Document.
   */
  getUser(): User {
    return this.item.user;
  }

  /**
   * Get the location this Card/Document is stored at.
   */
  getLocation(): string {
    return this.item.location;
  }

  /**
   * Get the comment associated with this Card/Document.
   */
  getComment(): string {
    return this.item.comment;
  }

  /**
   * Get the (Swedish) name of the primary type of this item.
   */
  getItemTypeString(): string {
    return this.isCard() ? 'Kort' : 'Handling';
  }

  /**
   * Returns string representation of last verified date
   */
  getLastVerifiedString(): string {
    if (this.item.lastVerificationDate) {
      return this.item.lastVerificationDate
        ? moment(this.item.lastVerificationDate).format('YYYY-MM-DD')
        : '-';
    } else {
      return 'Aldrig';
    }
  }

  /**
   * Returns string representation of last self check date
   */
  getLastSelfCheckString(): string {
    if (this.item.lastSelfCheckDate) {
      return this.item.lastSelfCheckDate
        ? moment(this.item.lastSelfCheckDate).format('YYYY-MM-DD')
        : '-';
    } else {
      return 'Aldrig';
    }
  }

  /**
   * Get id of the type of this item.
   */
  getItemType(): ItemType {
    return this.isCard() ? new ItemType('Kort') : new ItemType('Handling');
  }

  /**
   * Get the status of this Card/Document.
   */
  getStatus(): StatusType {
    return this.item.status;
  }

  /**
   * Type checking using instanceof can break as the Cards/Documents can lose
   * their types (but still keep their exact structures and are accepted by type-restricted functions),
   * so type checking is done this way instead.
   */
  isCard(): boolean {
    return this.itemType === BaseItem.CARD_NAME;
  }

  /**
   * see isCard() documentation
   */
  isDocument(): boolean {
    return this.itemType === BaseItem.DOCUMENT_NAME;
  }
}
