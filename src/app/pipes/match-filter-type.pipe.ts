import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { BaseType } from '../datamodels/baseType';
import { UtilitiesService, lowerCase } from '../services/utilities.service';

@Pipe({
  name: 'matchFilterType'
})
export class MatchFilterTypePipe implements PipeTransform {
  constructor(private utilitiesService: UtilitiesService) {}

  transform(
    value: BaseType[],
    input: string,
    showCardTypes: boolean,
    showDocumentTypes: boolean,
    showActive: boolean,
    showInactive: boolean
  ): BaseType[] {
    return _.filter(value, baseType => {
      return this.matchFilt(baseType, input, showCardTypes, showDocumentTypes, showActive, showInactive);
    });
  }

  /**
   * Match filterInput to the various displayed fields of card
   * @param card
   * @param filterInput
   * @param showCardTypes true if checkbox showCardTypes checked
   * @param showDocumentTypes true if checkbox showDocumentTypes checked
   * @param showActive true if checkbox showActive checked
   * @param showInactive true if checkbox showInactive checked
   * @returns True if match found
   */
  matchFilt(
    baseType: BaseType,
    filterInput: string,
    showCardTypes: boolean,
    showDocumentTypes: boolean,
    showActive: boolean,
    showInactive: boolean
  ) {
    if (
      !baseType ||
      !baseType.getType().id ||
      (baseType.isCardType() && !showCardTypes) ||
      (baseType.isDocumentType() && !showDocumentTypes) ||
      (baseType.getType().status.id == 5 && !showActive) ||
      (baseType.getType().status.id == 6 && !showInactive)
    ) {
      return false;
    }

    filterInput = lowerCase(filterInput);

    return (
      _.includes(lowerCase(baseType.getType().name), filterInput) === true ||
      _.includes(lowerCase(baseType.getType().creationDate), filterInput) === true ||
      _.includes(lowerCase(baseType.getType().modifiedDate), filterInput) === true
    );
  }
}
