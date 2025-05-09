import { CardType } from './cardType';
import { StatusType } from './statusType';
import { User } from './user';

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
  cardType: CardType;

  /**
   * Card serial number (can contain alphabetical characters)
   */
  cardNumber: string;

  /**
   * ID of current card holder
   */
  user: User;

  /**
   * Current location of card
   */
  location: string;

  /**
   * Comment
   */
  comment?: string;

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
   * Card checked in/out status
   */
  status: StatusType;

  /**
   * Active receipt (if any)
   */
  activeReceiptID?: number;

  /**
   * ID of last verification
   */
  lastVerificationID?: number;

  /**
   * Date of last verification
   */
  lastVerificationDate?: Date;

  /**
   * ID of last self check
   */
  lastSelfCheckID?: number;

  /**
   * Date of last self check
   */
  lastSelfCheckDate?: Date;

  /**
   * Registrator
   */
  registrator?: string;
}
