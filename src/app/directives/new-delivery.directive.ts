import { Directive, Input, OnDestroy } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as _ from 'lodash';
import { Delivery } from '../datamodels/delivery';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appNewDelivery]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NewDeliveryValidatorDirective, multi: true }]
})
export class NewDeliveryValidatorDirective implements Validator, OnDestroy {
  @Input() delivery: Delivery = null;

  deliveries: Delivery[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.deliveryList.subscribe(deliveries => {
      this.deliveries = deliveries;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);
    const deliveryMatch = _.find(this.deliveries, delivery => delivery.documentNumber === input);
    const isValid = !input || !deliveryMatch || (this.delivery && deliveryMatch.id === this.delivery.id);

    const message = {
      newDelivery: {
        message: 'Angivet dokument-ID för leverans existerar redan'
      }
    };
    return isValid ? null : message;
  }

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
