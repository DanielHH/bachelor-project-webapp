import { StatusType } from './statusType';

/**
 * DocumentType data model
 */
export class DocumentType {
  /**
   * Database ID of the document type
   */
  id: number;

  /**
   * Name of the document type
   */
  name: string;

  /**
   * Creation date of DocumentType in database
   */
  creationDate: Date;

  /**
   * Last modified date of the DocumentType
   */
  modifiedDate: Date;

  /**
   * DocumentType active/inactive status
   */
  status: StatusType;
}
