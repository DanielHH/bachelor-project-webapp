import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Card } from '../../../../datamodels/card';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as _ from 'lodash';
import * as moment from 'moment';

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

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService
  ) {
    this.modalService.detailCard.subscribe((card) => {
      if (card && card.id) {
        this.cardItem = card;
        this._showModal = true;
      }
    });

  }

  ngOnInit() { }

  showDetail() {
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

  displayExpirationDate() {
    if (this.cardItem) {
      return moment(this.cardItem.expirationDate).format('YYYY-MM-DD');
    }
  }

  displayCreationDate() {
    if (this.cardItem) {
      return moment(this.cardItem.creationDate).format('YYYY-MM-DD');
    }
  }

  displayModifiedDate() {
    if (this.cardItem) {
      return moment(this.cardItem.modifiedDate).format('YYYY-MM-DD');
    }
  }
}
