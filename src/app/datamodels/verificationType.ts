/**
 * VerificationType data model
 */
export class VerificationType {

  /**
   * Database ID of the verification type
   */
  id: number;

  /**
   * Name of the verification type
   */
  name: string;

  constructor(name: string) {
    if (name.toLowerCase() === 'egenkontroll') {
      this.id = 1;
      this.name = name;
    } else if (name.toLowerCase() === 'inventering') {
      this.id = 2;
      this.name = name;
    } else {
      console.error('Invalid inventory type: ' + name + '!');
    }
  }

}
