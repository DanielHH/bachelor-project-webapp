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
   * User ID of user who made the event
   */
  userID: number;

  /**
   * ID of log event type (examples: Add new card, Check out card, Check in card...)
   */
  logTypeID: number;

  /**
   * Log date of the event
   */
  logDate: Date;
}
