import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../datamodels/user';
import { HttpService } from '../../services/http.service';
import { RouteDataService } from '../../services/route-data.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.scss']
})
export class ItemMenuComponent implements OnInit, OnDestroy {
  @Input() object: any; // Card, CardType, Document or DocumentType

  @Input() adminMenu = false;

  @Input() isTypeItem = false;

  @Input() itemMenu = false;

  @Input() showHistoryOption = true;

  @Input() showEditOption = false;

  @Output() editObject = new EventEmitter<any>();

  @Output() editStatus = new EventEmitter<any>();

  user: User;

  authServiceSubscriber: any;

  constructor(
    private routeDataService: RouteDataService,
    private router: Router,
    private httpService: HttpService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService
  ) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => (this.user = user));
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.authServiceSubscriber.unsubscribe();
  }

  /**
   * Change route and send route data, TODO: FIX THIS FOR TYPES AND USERS AS WELL?
   */
  route() {
    if (this.object.cardType) {
      this.routeDataService.card.next(this.object);
      this.router.navigate(['card-history']);
    }

    if (this.object.documentType && this.object.location) {
      // document with a location, aka not a delivery
      this.routeDataService.document.next(this.object);
      this.router.navigate(['document-history']);
    }
  }

  /**
   * Set item or type to be outputted for editing.
   */
  setEdit() {
    this.editObject.next();
  }

  /**
   * Setter for item status
   * @param value value to be set in the database
   */
  setStatus(value: number) {
    if (
      // If is item that has owner and is being restored, set to "utkvitterad"
      this.itemMenu &&
      this.object.user &&
      this.object.user.id &&
      value == 1
    ) {
      this.object.status = this.utilitiesService.getStatusFromID(2);
    } else if (this.isTypeItem) {
      this.object.getType().status = this.utilitiesService.getStatusFromID(value);
    } else {
      this.object.status = this.utilitiesService.getStatusFromID(value);
    }

    this.editStatus.emit();
  }

  getStatusID() {
    if (this.isTypeItem) {
      return this.object.getType().status.id;
    } else {
      return this.object.status.id;
    }
  }

  /**
   * Returns true if the archive option should be shown in the menu.
   * The archive option is only visible if the menu is for an item
   * that can be archived the item is available.
   */
  showArchiveOption() {
    const isAvailable = this.object.status.id == 1;
    return this.itemMenu && isAvailable;
  }

  /**
   * Returns true if the lost option should be shown in the menu.
   * The lost option is only visible if the menu is for an object
   * that can be lost and that object is available or requested.
   */
  showLostOption() {
    const isAvailable = this.object.status.id == 1;
    const isRequested = this.object.status.id == 2;
    return this.itemMenu && (isAvailable || isRequested);
  }

  /**
   * Returns true if the restore option should be shown in the menu.
   * The restore option is only visible if the menu is for an object
   * that is archived or lost.
   */
  showRestoreOption() {
    const isArchived = this.object.status.id == 3;
    const isLost = this.object.status.id == 4;
    return this.itemMenu && (isArchived || isLost);
  }

  /**
   * Returns true if the activate option should be shown in the menu.
   * The activate option is only visible if the menu is for an object
   * that can be active or inactive, and that object is inactive.
   */
  showActivateOption() {
    const isInactive = this.getStatusID() === 6;
    return this.adminMenu && isInactive;
  }

  /**
   * Returns true if the inactivate option should be shown in the menu.
   * The inactivate option is only visible if the menu is for an object
   * that can be active or inactive, and that object is active.
   */
  showInactivateOption() {
    const isActive = this.getStatusID() === 5;
    return this.adminMenu && isActive;
  }
}
