import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { BaseItem } from '../datamodels/baseItem';
import { UtilitiesService, lowerCase } from '../services/utilities.service';

@Pipe({
  name: 'matchFilterInventory'
})
export class MatchFilterInventoryPipe implements PipeTransform {
  constructor(private utilitiesService: UtilitiesService) {}

  transform(
    value: BaseItem[],
    input: string,
    showIn: boolean,
    showOut: boolean,
    showArchived: boolean,
    showGone: boolean
  ): BaseItem[] {
    return _.filter(value, baseItem => {
      return this.matchFilt(baseItem, input, showIn, showOut, showArchived, showGone);
    });
  }

  /**
   * Match filterInput to the various displayed fields of card
   * @param card
   * @param filterInput
   * @param showIn true if checkbox showIn checked
   * @param showOut true if checkbox showOut checked
   * @param showArchived true if checkbox showArchived checked
   * @param showGone true if checkbox showGone checked
   * @returns True if match found
   */
  matchFilt(
    baseItem: BaseItem,
    filterInput: string,
    showIn: boolean,
    showOut: boolean,
    showArchived: boolean,
    showGone: boolean
  ) {
    if (
      !baseItem ||
      !baseItem.item.id ||
      (baseItem.getItem().status.id == 1 && !showIn) ||
      (baseItem.getItem().status.id == 2 && !showOut) ||
      (baseItem.getItem().status.id == 3 && !showArchived) ||
      (baseItem.getItem().status.id == 4 && !showGone)
    ) {
      return false;
    }

    filterInput = lowerCase(filterInput);

    return (
      _.includes(lowerCase(baseItem.getNumber()), filterInput) === true ||
      _.includes(lowerCase(baseItem.getSubType().name), filterInput) === true ||
      _.includes(lowerCase(this.utilitiesService.getUserString(baseItem.getItem().user)), filterInput) === true ||
      _.includes(lowerCase(baseItem.getItem().comment), filterInput) === true ||
      _.includes(lowerCase(baseItem.getItem().location), filterInput) === true ||
      _.includes(lowerCase(baseItem.getLastVerifiedString()), filterInput) === true
    );
  }
}
