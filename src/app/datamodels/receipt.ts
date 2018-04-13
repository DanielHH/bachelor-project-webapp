import { ItemType } from './itemType';
import { Card } from './card';
import { User } from './user';
import { Document } from './document';

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

}
