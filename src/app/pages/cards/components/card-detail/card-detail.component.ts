import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../../../../datamodels/card';
import { ModalService } from '../../../../services/modal.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit, OnDestroy {
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

  modalServiceSubscriber: any;

  @Input() historyRoute = true;

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService,
    private routeDataService: RouteDataService,
    private router: Router
  ) {
    this.modalServiceSubscriber = this.modalService.detailCard.subscribe(card => {
      if (card && card.id) {
        this.cardItem = card;
        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.modalService.detailCard.next(null);

    this.modalServiceSubscriber.unsubscribe();
  }

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

  /**
   * Go to item history
   */
  routeHistory() {
    this.routeDataService.card.next(this.cardItem);
    this.router.navigate(['card-history']);
    this._showModal = false;
  }
}
