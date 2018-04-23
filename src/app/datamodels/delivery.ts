import { DocumentType } from './documentType';
import { StatusType } from './statusType';

/**
 * Document delivery data model
*/
export class Delivery {

    /**
     * Database ID of the document
     */
    id: number;

    /**
     * Document type
     */
    documentType: DocumentType;

    /**
     * Document serial number (can contain alphabetical characters)
     */
    documentNumber: string;

    /**
     * Document name
     */
    name: string;

    /**
     * Document date
     */
    documentDate: Date;

    /**
     * Registration date
     */
    sentDate: Date;

   /**
     * Creation date of document in database
     */
    creationDate: Date;

    /**
     * Last modified date of the document
     */
    modifiedDate: Date;

    /**
     * Current location of document
     */
    receiver: string;

    /**
     * Comment
     */
    comment?: string;

    /**
     * Document checked in/out status
     */
    status: StatusType;

  }
