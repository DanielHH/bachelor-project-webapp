import { StatusType } from './statusType';

/**
 * CardType data model
 */
export class CardType {
  /**
   * Database ID of the card type
   */
  id: number;

  /**
   * Name of the card type
   */
  name: string;

  /**
   * Creation date of CardType in database
   */
  creationDate: Date;

  /**
   * Last modified date of the CardType
   */
  modifiedDate: Date;

  /**
   * CardType active/inactive status
   */
  status: StatusType;
}
