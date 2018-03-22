
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
   * Creation date of card in database
   */
  creationDate: Date;

  /**
   * Last modified date of the card
   */
  modifiedDate: Date;

  /**
   * Card status
   */
  status: number;

  constructor() {
    this.id = null;
    this.cardType = null;
    this.cardNumber = null;
    this.userID = null;
    this.location = null;
    this.comment = null;
    this.expirationDate = null;
    this.creationDate = null;
    this.modifiedDate = null;
    this.status = 0;
  }

}
