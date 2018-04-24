import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { Card } from '../../../../datamodels/card';
import { User } from '../../../../datamodels/user';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit, OnDestroy {
  @Input() cardItem: Card;

  user: User;
  cardList: Card[] = [];

  showRequestModal = false;
  showReturnModal = false;

  authServiceSubscriber: any;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private modalService: ModalService,
    public utilitiesService: UtilitiesService,
    private authService: AuthService
  ) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.authServiceSubscriber.unsubscribe();
  }

  /**
   * Show the modal for card details
   */
  showDetailsModal() {
    this.modalService.detailCard.next(this.cardItem);
  }

  /**
   * Show modal based on status
   * 1 == returned, 2 == available
   */
  showModal() {
    if (this.cardItem.status.id == 1) {
      this.modalService.requestCard.next(this.cardItem);
    } else {
      this.modalService.returnCard.next(this.cardItem);
    }
  }

  /**
   * Set card to be outputted for editing
   */
  edit() {
    this.modalService.editCard.next(this.cardItem);
  }

  /**
   * Sets the status of the card in the database
   */
  editStatus() {
    // Create new log event
    const logText = this.cardItem.cardNumber + ' till ' + this.cardItem.status.name;
    const logEvent = this.utilitiesService.createNewLogEventForItem(1, 12, this.cardItem, this.user, logText);

    this.httpService.httpPut<Card>('updateCard/', { cardItem: this.cardItem, logEvent: logEvent }).then(res => {
      if (res.message === 'success') {
        this.utilitiesService.updateLogEventList(res.data.logEvent);
      }
    });
  }
}
