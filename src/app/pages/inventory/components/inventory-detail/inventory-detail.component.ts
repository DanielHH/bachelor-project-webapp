import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { BaseItem } from '../../../../datamodels/baseItem';
import { Card } from '../../../../datamodels/card';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements OnInit, OnDestroy {
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

  baseItem: BaseItem = null;

  modalServiceSubscriber: any;

  authServiceSubscriber: any;

  user: User;

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService,
    private httpService: HttpService,
    private dataService: DataService,
    private routeDataService: RouteDataService,
    private router: Router,
    private authService: AuthService
  ) {
    this.modalServiceSubscriber = this.modalService.detailInventory.subscribe(baseItem => {
      if (baseItem && baseItem.item.id) {
        this.baseItem = baseItem;
        this._showModal = true;
      }
    });

    this.authServiceSubscriber = this.authService.user.subscribe(user => (this.user = user));
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.modalService.detailInventory.next(null);

    this.modalServiceSubscriber.unsubscribe();

    this.authServiceSubscriber.unsubscribe();
  }

  /**
   * Closes form.
   */
  closeForm() {
    this.detailForm.resetForm();

    this.baseItem = Object.assign({}, new BaseItem(new Card(), 'card'));
    this.modalService.detailInventory.next(this.baseItem);

    this.showModal = false;
  }

  /**
   * Go to item history
   */
  routeHistory() {
    if (this.baseItem.isCard()) {
      this.routeDataService.card.next(this.baseItem.getItem());
      this.router.navigate(['card-history']);
    } else {
      this.routeDataService.document.next(this.baseItem.getItem());
      this.router.navigate(['document-history']);
    }
    this._showModal = false;
  }
}
