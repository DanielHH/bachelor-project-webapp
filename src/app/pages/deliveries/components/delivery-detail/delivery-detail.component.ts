import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Delivery } from '../../../../datamodels/delivery';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

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

  constructor(private modalService: ModalService, public utilitiesService: UtilitiesService) {
    this.modalService.detailDelivery.subscribe(delivery => {
      if (delivery && delivery.id) {
        this.deliveryItem = delivery;
        this._showModal = true;
      }
    });
  }
  ngOnInit() {}

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
}
