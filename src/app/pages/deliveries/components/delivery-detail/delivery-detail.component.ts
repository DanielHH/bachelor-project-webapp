import { Document } from '../../../../datamodels/document';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Delivery } from '../../../../datamodels/delivery';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.scss']
})
export class DeliveryDetailComponent implements OnInit {

  @ViewChild('detailForm') detailForm: NgForm;

  showModal = false;

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    if (!value) {
      this.closeForm();
    }

    this.showModal = value;
  }

  deliveryItem: Delivery = null;

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService
  ) {
    this.modalService.detailDelivery.subscribe((delivery) => {
      if (delivery && delivery.id) {
        this.deliveryItem = delivery;
        this._showModal = true;
      }
    });

  }
  ngOnInit() {
  }

  hideDetail() {
    this.showModal = false;
  }

  /**
   * Closes form.
   */
  closeForm() {
    this.detailForm.resetForm();

    this.deliveryItem = Object.assign({}, new Delivery());
    this.modalService.detailDelivery.next(this.deliveryItem);

    this.showModal = false;
  }

  displayDocumentDate() {
    if (this.deliveryItem) {
      return moment(this.deliveryItem.documentDate).format('YYYY-MM-DD');
    }
  }

  displaySentDate() {
    if (this.deliveryItem) {
      return moment(this.deliveryItem.sentDate).format('YYYY-MM-DD');
    }
  }

  displayCreationDate() {
    if (this.deliveryItem) {
      return moment(this.deliveryItem.creationDate).format('YYYY-MM-DD');
    }
  }

  displayModifiedDate() {
    if (this.deliveryItem) {
      return moment(this.deliveryItem.modifiedDate).format('YYYY-MM-DD');
    }
  }
}
