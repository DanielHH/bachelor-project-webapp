import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Card } from '../../../../datamodels/card';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as _ from 'lodash';


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
    private routeDataService: RouteDataService,
    public utilitiesService: UtilitiesService
  ) {
    this.routeDataService.card.subscribe((card) => {
      this.cardItem = card;
      this._showModal = true;
      this.showModal = true;
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
    this.routeDataService.card.next(this.cardItem);

    this.showModal = false;
  }

  displayExpirationDate() {
    if (this.cardItem) {
      this.utilitiesService.getDateString(this.cardItem.expirationDate);
    }
  }
}
