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

}
