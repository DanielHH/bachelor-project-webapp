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
   * ID of receipt item type
   */
  itemType: ItemType;
  /**
   * Card ID of receipt
   */
  card?: Card;
  /**
   * Document ID of receipt item type
   */
  document?: Document;
  /**
   * ID of current receipt holder
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
