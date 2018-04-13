import { UserType } from './userType';
import { StatusType } from './statusType';

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
   * Returns true if user is has Admin UserType, else false
   */
  isAdmin() {
    return this.userType.id === 1;
  }

  /**
   * Returns true if user is has User UserType, else false
   */
  isUser() {
    return this.userType.id === 2;
  }

}
