import { DocumentType } from './documentType';
import { StatusType } from './statusType';
import { User } from './user';

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
  user: User;

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
  status: StatusType;

  /**
   * Active receipt (if any)
   */
  activeReceipt?: number;

  /**
   * ID of last verification
   */
  lastVerificationID?: number;

  /**
   * Date of last verification
   */
  lastVerificationDate?: Date;

  /**
   * Registrator
   */
  registrator?: string;
}
