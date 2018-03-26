import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Document } from '../../../../datamodels/document';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../../services/data.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../../services/utilities.service';
import { User } from '../../../../datamodels/user';

@Component({
  selector: 'app-request-document',
  templateUrl: './request-document.component.html',
  styleUrls: ['./request-document.component.scss']
})
export class RequestDocumentComponent implements OnInit {

  @ViewChild('requestForm') requestForm: NgForm;

  @Input() documentItem: Document = null; // Document that is requested

  @Input() showModal = false;

  @Output() modalClosed = new EventEmitter<boolean>();

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    this.closeForm();
  }

  users = [];

  usernameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);

  usernameInput: any;
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
        str && typeof str === "string" &&
        user.username.toLowerCase().indexOf(str.toLowerCase()) === 0

    );
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
      this.documentItem.user = this.usernameInput;
      this.documentItem.location = this.locationInput;
      this.documentItem.status = this.utilitiesService.getStatusFromID(2);; // TODO: ENUM FOR STATUS, 2 = Requested
      console.log(this.documentItem);          
        
      this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(res => {
        if (res.message === 'success') {
          this.closeForm();
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
    this.showModal = false;
    this.modalClosed.emit(false);
  }

  displayUser(user?: User) {
    return user ? user.username : '';
  }

}
