/**
 * LogEvent data model
*/
export class LogEvent {

  /**
   * Database ID of the log event
   */
  id: number;

  /**
   * ID of log event item type (Card or Document)
   */
  itemTypeID: number;

  /**
   * Card ID of log event
   */
  cardID?: number;

  /**
   * Document ID of log event
   */
  documentID?: number;

  /**
   * Current owner ID of log event
   */
  currentOwnerID?: number;

  /**
   * User ID of user who made the event
   */
  userID: number;

  /**
   * ID of log event type (examples: Add new card, Requesting card, Returning card...)
   */
  logTypeID: number;

  /**
   * Log date of the event
   */
  logDate: Date;

  constructor() {
    this.id = null;
    this.itemTypeID = null;
    this.cardID = null;
    this.documentID = null;
    this.currentOwnerID = null;
    this.userID = null;
    this.logTypeID = null;
    this.logDate = null;
  }

}
