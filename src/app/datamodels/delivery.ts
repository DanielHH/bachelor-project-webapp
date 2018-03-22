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
    comment: string;
  
    /**
     * document checked in/out status
     */
    status: number;
  
    constructor() {
      this.id = null;
      this.documentType = null;
      this.documentNumber = null;
      this.name = null;
      this.documentDate = null;
      this.sentDate = null;
      this.creationDate = null;
      this.modifiedDate = null;
      this.receiver = null;
      this.comment = null;
      this.status = 0;
    }
  
  }
  