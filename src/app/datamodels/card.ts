
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
   * Full name of current card holder
   */
  user: string;

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

}
