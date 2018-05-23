import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { Receipt } from '../../../../datamodels/receipt';
import { User } from '../../../../datamodels/user';
import { ModalService } from '../../../../services/modal.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-receipt-detail',
  templateUrl: './receipt-detail.component.html',
  styleUrls: ['./receipt-detail.component.scss']
})
export class ReceiptDetailComponent implements OnInit, OnDestroy {
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

  receiptItem: Receipt = null;

  typeToDisplay: string;
  idToDisplay: string;

  modalServiceSubscriber: any;

  authServiceSubscriber: any;

  user: User;

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService,
    private routeDataService: RouteDataService,
    private router: Router,
    private authService: AuthService
  ) {
    this.modalServiceSubscriber = this.modalService.detailReceipt.subscribe(receipt => {
      if (receipt && receipt.id) {
        this.receiptItem = receipt;

        if (this.receiptItem.card) {
          this.typeToDisplay = this.receiptItem.card.cardType.name;
          this.idToDisplay = this.receiptItem.card.cardNumber;
        } else if (this.receiptItem.document) {
          this.typeToDisplay = this.receiptItem.document.documentType.name;
          this.idToDisplay = this.receiptItem.document.documentNumber;
        }

        this._showModal = true;
      }
    });

    this.authServiceSubscriber = this.authService.user.subscribe(user => (this.user = user));
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.modalService.detailReceipt.next(null);

    this.modalServiceSubscriber.unsubscribe();

    this.authServiceSubscriber.unsubscribe();
  }

  /**
   * Closes form.
   */
  closeForm() {
    this.detailForm.resetForm();

    this.receiptItem = Object.assign({}, new Receipt());
    this.modalService.detailReceipt.next(this.receiptItem);

    this.showModal = false;
  }

  /**
   * Go to item history
   */
  routeHistory() {
    if (this.receiptItem.card) {
      this.routeDataService.card.next(this.receiptItem.card);
      this.router.navigate(['card-history']);
    } else {
      this.routeDataService.document.next(this.receiptItem.document);
      this.router.navigate(['document-history']);
    }
    this._showModal = false;
  }
}
