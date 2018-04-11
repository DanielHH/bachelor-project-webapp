import { Card } from './card';
import { Document } from './document';
import { CardDetailComponent } from '../pages/cards/components/card-detail/card-detail.component';
import { CardType } from './cardType';
import { User } from './user';
import { StatusType } from './statusType';
import { Verification } from './verification';
import { ItemType } from './itemType';
import { UtilitiesService } from '../services/utilities.service';


/**
 * A BaseType can be either a CardType or a DocumentType.
 */
export class BaseType {

  /**
   * The CardType or DocumentType this BaseType represents.
   */
  type: CardType|DocumentType;

  /**
   * String representation of this type
   */
  typeStr: string;

  constructor(
    private utilitiesService: UtilitiesService,
    type: CardType|DocumentType,
    typeStr: string) {
    this.type = type;
    this.typeStr = typeStr;
    if (typeStr !== 'cardType' && typeStr !== 'documentType') {
      console.error('invalid basetype');
    }
  }

  /**
   * Get the (Swedish) name of this type.
  */
  getTypeString(): string {
    return this.type.name;
  }

  /**
   * Get id of this type.
  */
  getType(): any {
    if (this.isCardType()) {
      return this.type as CardType;
    } else {
      return this.type as DocumentType;
    }
  }

  /**
   * Returns true if this type is a card type, else false
  */
  isCardType(): boolean {
    return this.typeStr === 'cardType';
  }

  /**
   * Returns true if this type is a document type, else false
   */
  isDocumentType(): boolean {
    return this.typeStr === 'documentType';
  }

}
