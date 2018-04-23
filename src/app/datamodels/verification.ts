import { Card } from './card';
import { Document } from './document';
import { ItemType } from './itemType';
import { User } from './user';
import { VerificationType } from './verificationType';

/**
 * Verification data model
 */
export class Verification {
  /**
   * Database ID of the verification
   */
  id: number;

  /**
   * Verification type
   */
  verificationType: VerificationType;

  /**
   * Verification item type
   */
  itemType: ItemType;

  /**
   * Card of verification
   */
  card?: Card;

  /**
   * Document of verification
   */
  document?: Document;

  /**
   * Current card or document holder
   */
  user?: User;

  /**
   * Date of the verification
   */
  verificationDate: Date;
}
