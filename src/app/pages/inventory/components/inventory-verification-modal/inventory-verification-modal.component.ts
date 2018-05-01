import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-inventory-verification-modal',
  templateUrl: './inventory-verification-modal.component.html',
  styleUrls: ['./inventory-verification-modal.component.scss']
})
export class InventoryVerificationModalComponent implements OnInit, OnDestroy {

  modalTitle = 'Verifiera objekt';

  numObjects = 0;
  markedString = 'markerat';

  @Input() showModal = false;

  @Output() showModalChange = new EventEmitter<any>();

  @Output() verifyInventoryChange = new EventEmitter<any>();

  get _showModal() {
    return this.showModal;
  }

  set _showModal(value: any) {
    if (!value) {
      this.closeModal();
    }
    this.showModal = value;
  }

  modalServiceSubscriber: any;

  constructor(
    private modalService: ModalService
  ) {

    this.modalServiceSubscriber = this.modalService.numVerifyObjects.subscribe(numObjects => {
      if (numObjects) {
        this.numObjects = numObjects;
        this.markedString = numObjects > 1 ? 'markerade' : 'markerat';

        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.modalServiceSubscriber.unsubscribe();
  }

  /**
   * Attempts to submit new user to database
   */
  verifyInventory() {
    this.verifyInventoryChange.next();

    this.closeModal();
  }

  /**
   * Closes modal
   */
  closeModal() {
    this.numObjects = 0;
    this.showModal = false;
    this.showModalChange.emit(false);
  }
}
