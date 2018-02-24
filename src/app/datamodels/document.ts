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
  comment: string;

  /**
   * document checked in/out status
   */
  status: boolean;

}
