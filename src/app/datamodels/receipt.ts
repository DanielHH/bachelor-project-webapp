import { Card } from './card';
import { CardType } from './cardType';
import { Document } from './document';
import { DocumentType } from './documentType';
import { ItemType } from './itemType';
import { User } from './user';

/**
 * Receipt data model
 */
export class Receipt {
  /**
   * Database ID of the receipt
   */
  id: number;

  /**
   * Receipt item type
   */
  itemType: ItemType;

  /**
   * Card associated with receipt
   */
  card?: Card;

  /**
   * Document associated with receipt
   */
  document?: Document;

  /**
   * Current receipt holder
   */
  user: User;

  /**
   * Start date of the receipt
   */
  startDate: Date;

  /**
   * End date of the receipt
   */
  endDate: Date;

  /**
   * PDF url
   */
  url: string;

  constructor(receipt?: Receipt) {
    if (receipt && receipt.id) {
      this.id = receipt.id;
      this.itemType = receipt.itemType;
      this.card = receipt.card;
      this.document = receipt.document;
      this.user = receipt.user;
      this.startDate = receipt.startDate;
      this.endDate = receipt.endDate;
    }
  }

  getItem(): Card | Document {
    return this.card ? this.card : this.document;
  }

  getSubType(): CardType | DocumentType {
    return this.card ? this.card.cardType : this.document.documentType;
  }

  getUser(): User {
    return this.card ? this.card.user : this.document.user;
  }

  getNumber(): string {
    return this.card ? this.card.cardNumber : this.document.documentNumber;
  }
}
