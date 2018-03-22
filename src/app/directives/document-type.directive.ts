import { Directive } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';
import { DataService } from '../services/data.service';
import { DocumentType } from '../datamodels/documentType';
import * as _ from 'lodash';

@Directive({
  selector: '[appDocumentType]',
  providers: [{provide: NG_VALIDATORS, useExisting: DocumentTypeValidatorDirective, multi: true}]
 })
 export class DocumentTypeValidatorDirective implements Validator {

  docTypes: DocumentType[] = [];

  constructor(public dataService: DataService) {
    this.dataService.documentTypeList.subscribe( (docTypes) => {
      this.docTypes = docTypes;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);

    const isValid = !input || _.find(this.docTypes, (docType) => docType.name === input);
    const message = {
      'docType': {
        'message': 'Ogiltig typ'
      }
    };
    return isValid ? null : message;
  }
 }
