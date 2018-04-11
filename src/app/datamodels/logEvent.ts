import { ItemType } from './itemType';
import { Card } from './card';
import { Document } from './document';
import { User } from './user';
import { LogType } from './logType';

/**
 * LogEvent data model
*/
export class LogEvent {

 /**
     * Database ID of the log event
     */
    id: number;

    /**
     *  of log event item type (Card or Document)
     */
    itemType: ItemType;

    /**
     * Card ID of log event
     */
    card?: Card;

    /**
     * Document ID of log event
     */
    document?: Document;

    /**
     * User ID of user who made the event
     */
    user: User;

    /**
     * ID of log event type (examples: Add new card, Requesting card, Returning card...)
     */
    logType: LogType;

    /**
     * Log date of the event
     */
    logDate: Date;

    /**
     * Log text
     */
    logText: string;

}
