import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { AuthService } from '../../../../auth/auth.service';
import { User } from '../../../../datamodels/user';

@Component({
  selector: 'app-inventory-verification-modal',
  templateUrl: './inventory-verification-modal.component.html',
  styleUrls: ['./inventory-verification-modal.component.scss']
})
export class InventoryVerificationModalComponent implements OnInit, OnDestroy {

  modalTitle = '';

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
  authServiceSubscriber: any;

  user: User;

  constructor(
    private modalService: ModalService,
    private authService: AuthService
  ) {

    this.modalServiceSubscriber = this.modalService.numVerifyObjects.subscribe(numObjects => {
      if (numObjects) {
        this.numObjects = numObjects;
        this.markedString = numObjects > 1 ? 'markerade' : 'markerat';
        this.modalTitle = this.user && this.user.userType.id == 1 ? 'Inventering' : 'Egenkontroll';

        this._showModal = true;
      }
    });

    this.authServiceSubscriber = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.modalServiceSubscriber.unsubscribe();
    this.authServiceSubscriber.unsubscribe();
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

  /**
   * Returns the verification confirm string based of the user
   */
  getVerifyConfirmString() {
    return this.user && this.user.userType.id == 1 ? 'Inventera' : 'Utför egenkontroll på';
  }

}
