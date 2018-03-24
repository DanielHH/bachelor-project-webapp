import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { CardType } from '../../../../datamodels/cardType';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import { EditService } from '../../../../services/edit.service';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {
  @Input() cardItem: Card;

  showRequestModal = false;
  showReturnModal = false;

  constructor(
    private dataService: DataService,
    private routeDataService: RouteDataService,
    private router: Router,
    private httpService: HttpService,
    private editService: EditService) {

  }

  ngOnInit() { }

  /**
   * Returns a string representation of the expirationDate of the card
   */
  displayExpirationDate() {
    return moment(this.cardItem.expirationDate).format('YYYY-MM-DD');
  }

  /**
   * Change route and send route data
   */
  route() {
    this.routeDataService.card.next(this.cardItem);
    this.router.navigate(['card-detail']);
  }

  /**
   * Set card to be outputted for editing
  */
  edit() {
    this.editService.card.next(this.cardItem);
  }

  /**
   * Show modal based on status
   */
  showModal() {
    const returnedStatus = 1;
    if (this.cardItem.status.id == returnedStatus) { // Don't change to ===, doesn't work
      this.showRequestModal = true;
    } else {
      this.showReturnModal = true;
    }
  }

  /**
   * Sets the status of the card
   */
  editStatus() {
    this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(res => {
      if (res.message === 'success') { }
    });
  }
}

