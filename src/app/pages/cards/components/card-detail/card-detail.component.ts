import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Card } from '../../../../datamodels/card';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {
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

  cardItem: Card = null;

  constructor(private modalService: ModalService, public utilitiesService: UtilitiesService) {
    this.modalService.detailCard.subscribe(card => {
      if (card && card.id) {
        this.cardItem = card;
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

    this.cardItem = Object.assign({}, new Card());
    this.modalService.detailCard.next(this.cardItem);

    this.showModal = false;
  }
}
