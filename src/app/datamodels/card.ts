
/**
 * Card data model
*/
export class Card {

  /**
   * Database ID of the card
   */
  id: number;

  /**
   * Card type
   */
  cardType: number;

  /**
   * Card serial number (can contain alphabetical characters)
   */
  cardNumber: string;

  /**
   * ID of current card holder
   */
  userID: number;

  /**
   * Current location of card
   */
  location: string;

  /**
   * Comment
   */
  comment: string;

  /**
   * Expiration date of the card
   */
  expirationDate: Date;

  /**
   * Card status
   */
  status: Number;

  constructor() {
    this.cardType = null;
    this.cardNumber = null;
    this.userID = null;
    this.location = null;
    this.comment = '';
    this.expirationDate = null;
    this.status = 0;
  }

}
