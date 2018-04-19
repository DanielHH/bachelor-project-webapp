import { Card } from './card';
import { Document } from './document';
import { CardDetailComponent } from '../pages/cards/components/card-detail/card-detail.component';
import { CardType } from './cardType';
import { DocumentType } from './documentType';
import { User } from './user';
import { StatusType } from './statusType';
import { Verification } from './verification';
import { ItemType } from './itemType';
import { UtilitiesService, lowerCase } from '../services/utilities.service';
import { VerificationType } from './verificationType';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';


/**
 * A BaseItem can be either a Card or a Document.
*/
export class BaseItem {

  /**
   * The names identifying the item type.
   */
  private static CARD_NAME = 'card';
  private static DOCUMENT_NAME = 'document';

  /**
   * The Card or Document this BaseItem represents.
  */
  item: Card|Document;

  /**
   * The type of item this BaseItem represents.
   */
  itemType: string;

  /**
   * Returns true if this item is selected in the table
   */
  isChecked: boolean;

  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];
  verificationList: Verification[];
  cardList: Card[] = [];
  documentList: Document[];
  itemList: BaseItem[];

  constructor(
    private utilitiesService: UtilitiesService,
    private dataService: DataService,
    private httpService: HttpService,
    item: Card|Document,
    itemType: string) {
    this.item = item;
    this.itemType = itemType;
    this.isChecked = false;
    if (itemType !== BaseItem.CARD_NAME && itemType !== BaseItem.DOCUMENT_NAME) {
      console.error('invalid baseitem type');
    }

    this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });
    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
    this.dataService.verificationList.subscribe(verificationList => {
      this.verificationList = verificationList;
    });
    this.dataService.cardList.subscribe(cardList => {
      this.cardList = cardList;
    });
    this.dataService.documentList.subscribe(documentList => {
      this.documentList = documentList;
    });
  }

  /**
   * Get the card or document that this item represents
  */
  getItem(): any {
    if (this.isCard()) {
      return (this.item as Card);
    } else {
      return (this.item as Document);
    }
  }

  /**
   * Return the type of Card if this BaseItem represents a Card,
   * or the type of Document if this BaseItem represents a Document.
  */
  getSubType(): CardType|DocumentType {
    if (this.isCard()) {
      return (this.item as Card).cardType;
    } else {
      return (this.item as Document).documentType;
    }
  }

  /**
   * Get the card or document number for this item.
  */
  getNumber(): string {
    if (this.isCard()) {
      return (this.item as Card).cardNumber;
    } else {
      return (this.item as Document).documentNumber;
    }
  }

  /**
   * Get the user associated with this Card/Document.
  */
  getUser(): User {
    return this.item.user;
  }

  /**
   * Get the location this Card/Document is stored at.
  */
  getLocation(): string {
    return this.item.location;
  }

  /**
   * Get the comment associated with this Card/Document.
  */
  getComment(): string {
    return this.item.comment;
  }

  /**
   * Get the (Swedish) name of the primary type of this item.
  */
  getItemTypeString(): string {
    return this.isCard() ? 'Kort' : 'Handling';
  }

  /**
   * Returns string representation of last verified date
   */
  getLastVerifiedString(): string {
    if (this.item.lastVerificationDate) {
      return this.utilitiesService.getDateString(this.item.lastVerificationDate, 'YYYY-MM-DD HH:MM:SS');
    } else {
      return 'Aldrig';
    }
  }

  /**
   * Get id of the type of this item.
  */
  getItemType(): ItemType {
    return this.isCard() ? new ItemType('Kort') : new ItemType('Handling');
  }

  /**
   * Get the status of this Card/Document.
  */
  getStatus(): StatusType {
    return this.item.status;
  }

  /**
   * Type checking using instanceof can break as the Cards/Documents can lose
   * their types (but still keep their exact structures and are accepted by type-restricted functions),
   * so type checking is done this way instead.
  */
  isCard(): boolean {
    return this.itemType === BaseItem.CARD_NAME;
  }

  /**
   * see isCard() documentation
   */
  isDocument(): boolean {
    return this.itemType === BaseItem.DOCUMENT_NAME;
  }

  /**
   * Send a message to the backend updating when this item was last inventoried
   * to be the current time.
   */
  verifyInventory(selfVerification = false): void {
    const itemToUpdate: Card | Document = this.getItem();

    const verification = new Verification();

    if (this.isCard()) {
      verification.card = itemToUpdate as Card;
      verification.document = null;
    } else {
      verification.document = itemToUpdate as Document;
      verification.card = null;
    }

    if (this.getUser() && this.getUser().id !== 0) {
      verification.user = this.getUser();
    } else {
      verification.user = null;
    }

    if (itemToUpdate.activeReceipt === 0) {
      itemToUpdate.activeReceipt = null;
    }

    verification.verificationType = selfVerification
      ? new VerificationType('Egenkontroll')
      : new VerificationType('Inventering');
    verification.itemType = this.getItemType();
    verification.verificationDate = this.utilitiesService.getLocalDate();

    // Submit changes to database
    this.httpService.httpPost<Verification>('addNewVerification/', verification).then(verificationRes => {
      if (verificationRes.message === 'success') {
        itemToUpdate.lastVerificationID = Number(verificationRes.data.id);
        itemToUpdate.lastVerificationDate = this.utilitiesService.getLocalDate();
        itemToUpdate.modifiedDate = this.utilitiesService.getLocalDate();

        if (this.isCard()) {
          this.httpService.httpPut<Card>('updateCard/', { cardItem: itemToUpdate }).then(cardRes => {
            if (cardRes.message === 'success') {
              this.dataService.cardList.next(this.cardList);
            }
          });
        } else {
          this.httpService.httpPut<Document>('updateDocument/', { documentItem: itemToUpdate }).then(documentRes => {
            if (documentRes.message === 'success') {
              this.dataService.documentList.next(this.documentList);
            }
          });
        }

        // Update verification list
        this.verificationList.unshift(verificationRes.data);
        this.verificationList = this.verificationList.slice();
        this.dataService.verificationList.next(this.verificationList);
      }
    });
  }
}
