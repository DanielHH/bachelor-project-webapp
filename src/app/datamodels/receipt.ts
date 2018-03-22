
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
  itemTypeID: number;

  /**
   * Card ID of receipt
   */
  cardID?: number;

  /**
   * Document ID of receipt item type
   */
  documentID?: number;

  /**
   * ID of current receipt holder
   */
  userID: number;

  /**
   * Start date of the receipt
   */
  startDate: Date;

  /**
   * End date of the receipt
   */
  endDate: Date;

  /**
   * Comment
   */
  comment: string;

  constructor() {
    this.id = null;
    this.itemTypeID = null;
    this.cardID = null;
    this.documentID = null;
    this.userID = null;
    this.startDate = null;
    this.endDate = null;
    this.comment = null;
  }

}
