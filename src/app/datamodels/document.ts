
/**
 * Document data model
*/
export class Document {

  /**
   * Database ID of the document
   */
  id: number;

  /**
   * Document type
   */
  documentType: number;

  /**
   * Document serial number (can contain alphabetical characters)
   */
  documentNumber: string;

  /**
   * Document name
   */
  name: string;

  /**
   * Document sender
   */
  sender: string;

  /**
   * Document date
   */
  documentDate: Date;

  /**
   * Registration date
   */
  registrationDate: Date;

 /**
   * Creation date of document in database
   */
  creationDate: Date;

  /**
   * Last modified date of the document
   */
  modifiedDate: Date;

  /**
   * ID of current document holder
   */
  userID: number;

  /**
   * Current location of document
   */
  location: string;

  /**
   * Comment
   */
  comment?: string;

  /**
   * Document checked in/out status
   */
  status: number;

  /**
   * Active receipt (if any)
   */
  activeReceipt?: number;

  constructor() {
    this.id = null;
    this.documentType = null;
    this.documentNumber = null;
    this.name = null;
    this.sender = '';
    this.documentDate = null;
    this.registrationDate = null;
    this.creationDate = null;
    this.modifiedDate = null;
    this.userID = null;
    this.location = null;
    this.comment = null;
    this.status = 0;
    this.activeReceipt = null;
  }

}
