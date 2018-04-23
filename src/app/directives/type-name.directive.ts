import { Directive, Input } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as _ from 'lodash';
import { CardType } from '../datamodels/cardType';
import { DocumentType } from '../datamodels/documentType';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appTypeName]',
  providers: [{ provide: NG_VALIDATORS, useExisting: TypeNameValidatorDirective, multi: true }]
})
export class TypeNameValidatorDirective implements Validator {
  @Input() isCardType: boolean;
  @Input() type: any; // CardType or DocumentType

  cardTypes: CardType[] = [];
  docTypes: DocumentType[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardTypeList.subscribe(cardTypes => {
      this.cardTypes = cardTypes;
    });

    this.dataService.documentTypeList.subscribe(docTypes => {
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
        const cardTypeMatch = _.find(this.cardTypes, cardType => cardType.name === input);
        isValid = !cardTypeMatch || (this.type && cardTypeMatch.id === this.type.id);
        messageStr = 'Korttyp med angiven benämning existerar redan';
      } else {
        const docTypeMatch = _.find(this.docTypes, docType => docType.name === input);
        isValid = !docTypeMatch || (this.type && docTypeMatch.id === this.type.id);
        messageStr = 'Dokumenttyp med angiven benämning existerar redan';
      }
    }

    const message = {
      typeName: {
        message: messageStr
      }
    };
    return isValid ? null : message;
  }
}
