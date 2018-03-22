import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Document } from '../../../../datamodels/document';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../../services/data.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as _ from 'lodash';
import { Receipt } from '../../../../datamodels/receipt';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-request-document',
  templateUrl: './request-document.component.html',
  styleUrls: ['./request-document.component.scss']
})
export class RequestDocumentComponent implements OnInit {

  @ViewChild('requestForm') requestForm: NgForm;

  documentItem: Document = null; // Document that is requested

  @Input() showModal = false;

  /**
   * Set document that is being requested.
   */
  @Input('document') set document(document: Document) {
    if (document && document.id) {
      this.documentItem = document;
    }
  }

  @Output() showModalChange = new EventEmitter<boolean>();

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    this.closeForm();
  }

  users = [];
  documents: Document[] = [];
  receipts: Receipt[] = [];

  usernameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);

  usernameInput = '';
  locationInput = '';

  filteredUsers: Observable<any[]> = this.usernameControl.valueChanges.pipe(
    startWith(''),
    map(val => this.filterUsers(val))
  );

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService
  ) {
    this.dataService.userList.subscribe(users => {
      this.users = users;
      this.usernameControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    this.dataService.documentList.subscribe(documents => {
      this.documents = documents;
    });

    this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });
  }

  ngOnInit() {
  }

  /**
   * Filters list of usernames based on username input
   * @param str username input
   */
  filterUsers(str: string) {
    return this.users.filter(
      user =>
        str != null &&
        user.username.toLowerCase().indexOf(str.toLowerCase()) === 0
    );
  }

  /**
   * Returns user id of user with username
   * @param username Username of user
   */
  getUserID(username: String) {
    return _.find(this.users, user => user.username === username).id;
  }

  /**
   * Returns true if entered username is valid, else false.
   */
  isValidUsername() {
    return (
      !this.usernameControl.hasError('required') &&
      !this.usernameControl.hasError('username')
    );
  }

  /**
   * Returns true if entered location is valid, else false.
   */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return (
      this.isValidUsername() &&
      this.isValidLocation()
    );
  }

  /**
   * Change status of a document to requested
   */
  requestDocument() {
    if (this.isValidInput()) {
      this.documentItem.userID = this.getUserID(this.usernameInput);
      this.documentItem.location = this.locationInput;
      this.documentItem.status = 2; // TODO: ENUM FOR STATUS, 2 = Requested


      const receipt = new Receipt();

      receipt.itemTypeID = 2; // TODO: ENUM, 2 means document
      receipt.documentID = this.documentItem.id;
      receipt.userID = this.documentItem.userID;
      receipt.startDate = this.utilitiesService.getLocalDate();

      this.httpService.httpPost<Receipt>('addNewReceipt/', receipt).then(receiptRes => {
        if (receiptRes.message === 'success') {
          this.receipts.unshift(receiptRes.data);
          // Trigger view refresh
          this.receipts = this.receipts.slice();
          this.dataService.receiptList.next(this.receipts);

          this.documentItem.activeReceipt = receiptRes.data.id;
          console.log(this.documentItem.activeReceipt);

          this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(documentRes => {
            if (documentRes.message === 'success') {
              this.dataService.documentList.next(this.documents);
              this.closeForm();
            }
          });
        }
      });
    }
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.usernameControl.reset();
    this.locationControl.reset();
    this.requestForm.resetForm();
    this.documentItem = Object.assign({}, new Document());
    this.showModal = false;
    this.showModalChange.emit(false);
  }

}
