import { Directive, Input } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';
import { DataService } from '../services/data.service';
import { CardType } from '../datamodels/cardType';
import { DocumentType } from '../datamodels/documentType';
import * as _ from 'lodash';

@Directive({
  selector: '[appTypeName]',
  providers: [{provide: NG_VALIDATORS, useExisting: TypeNameValidatorDirective, multi: true}]
 })
 export class TypeNameValidatorDirective implements Validator {

  @Input() isCardType: boolean;

  cardTypes: CardType[] = [];
  docTypes: DocumentType[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardTypeList.subscribe( (cardTypes) => {
      this.cardTypes = cardTypes;
    });

    this.dataService.documentTypeList.subscribe( (docTypes) => {
      this.docTypes = docTypes;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);

    let isValid;
    let messageStr;
    if (!input) {
      isValid = true;
    } else {
      if (this.isCardType) {
        const cardTypeMatch = _.find(this.cardTypes, (cardType) => cardType.name === input);
        isValid = !cardTypeMatch;
        messageStr = 'Korttyp med angiven benämning existerar redan';
      } else {
        const docTypeMatch = _.find(this.docTypes, (docType) => docType.name === input);
        isValid = !docTypeMatch;
        messageStr = 'Dokumenttyp med angiven benämning existerar redan';
      }
    }

    const message = {
      'typeName': {
        'message': messageStr
      }
    };
    return isValid ? null : message;
  }
 }
