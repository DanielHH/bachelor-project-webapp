/**
 * ItemType data model
 */
export class ItemType {

  /**
   * Database ID of the item type
   */
  id: number;

  /**
   * Name of the item type
   */
  name: string;

  constructor(name: string) {
    if (name.toLowerCase() == 'kort') {
      this.name = 'Kort';
      this.id = 1;
    } else if (name.toLowerCase() == 'handling') {
      this.name = 'Handling';
      this.id = 2;
    } else {
      console.error('Invalid itemType name: ' + name + '!');
    }
  }

}
