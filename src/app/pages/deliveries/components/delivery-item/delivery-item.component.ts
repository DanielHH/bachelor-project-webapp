import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import * as _ from 'lodash';
import { Delivery } from '../../../../datamodels/delivery';
import * as moment from 'moment';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-delivery-item',
  templateUrl: './delivery-item.component.html',
  styleUrls: ['./delivery-item.component.scss']
})
export class DeliveryItemComponent implements OnInit {
  @Input() deliveryItem: Delivery;
  @Output() editItem = new EventEmitter<any>();

  showRequestModal = false;

  showReturnModal = false;

  constructor(
    private routeDataService: RouteDataService,
    public utilitiesService: UtilitiesService,
    private router: Router,
    private modalService: ModalService,
    private httpService: HttpService
  ) { }

  ngOnInit() {
  }

  route() {
    this.routeDataService.delivery.next(this.deliveryItem);
    this.router.navigate(['delivery-detail']);
  }

  /**
   * Show the modal for delivery details
   */
  showDetailsModal() {
    this.modalService.detailDelivery.next(this.deliveryItem);
  }

  /**
   * Set document to be outputted for editing
   */
  edit() {
    this.modalService.editDelivery.next(this.deliveryItem);
  }

  /**
   * Sets the status of the delivery in the database
  */
  editStatus() {
    this.httpService.httpPut<Delivery>('updateDelivery/', this.deliveryItem).then(res => {
      if (res['message'] === 'success') { }
    });
  }

}
