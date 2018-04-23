import { StatusType } from './statusType';
import { UserType } from './userType';

/**
 * User data model
 */
export class User {
  /**
   * Database ID of the user
   */
  id: number;

  /**
   * User type
   */
  userType: UserType;

  /**
   * Username
   */
  username: string;

  /**
   * Full name of user
   */
  name: string;

  /**
   * Email
   */
  email: string;

  /**
   * Creation date of User in database
   */
  creationDate: Date;

  /**
   * Last modified date of User
   */
  modifiedDate: Date;

  /**
   * User active/inactive status
   */
  status: StatusType;

  /**
   * Password when adding a new user
   */
  password?: string;
}
