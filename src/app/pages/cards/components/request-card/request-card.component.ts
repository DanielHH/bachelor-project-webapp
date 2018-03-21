import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Card } from '../../../../datamodels/card';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../../services/data.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as _ from 'lodash';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss']
})
export class RequestCardComponent implements OnInit {

  @ViewChild('requestForm') requestForm: NgForm;

  cardItem: Card = null; // Card that is requested

  @Input() showModal = false;

  /**
   * Set card that is being requested.
   */
  @Input('card') set card(card: Card) {
    if (card && card.id) {
      this.cardItem = card;
    }
  }

  @Output() modalClosed = new EventEmitter<boolean>();

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    if (this.showModal) {
      this.closeForm();
    }
  }

  users = [];

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
    private dataService: DataService
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
   * Change status of a card to requested
   */
  requestCard() {
    if (this.isValidInput()) {
      this.cardItem.userID = this.getUserID(this.usernameInput);
      this.cardItem.location = this.locationInput;
      this.cardItem.status = 2; // TODO: ENUM FOR STATUS, 2 = Requested
      this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(res => {
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
    this.cardItem = Object.assign({}, new Card());
    this.showModal = false;
    this.modalClosed.emit(false);
  }

}
