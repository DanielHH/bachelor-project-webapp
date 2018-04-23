import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Delivery } from '../../../../datamodels/delivery';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';

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
  ) {}

  ngOnInit() {}

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
      if (res.message === 'success') {
      }
    });
  }
}
