import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Card } from '../../../../datamodels/card';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../../services/data.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../../services/utilities.service';
import { User } from '../../../../datamodels/user';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss']
})
export class RequestCardComponent implements OnInit {

  @ViewChild('requestForm') requestForm: NgForm;

  cardItem: Card = null; // Card that is requested

  /**
   * Set card that is being requested.
   */
  @Input('card') set card(card: Card) {
    if (card && card.id) {
      this.cardItem = card;
    }
  }

  @Input() showModal = false;

  @Output() showModalChange = new EventEmitter<boolean>();

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

  user: User;

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
      this.cardItem.user = this.usernameInput;
      this.cardItem.location = this.locationInput;
      this.cardItem.status = this.utilitiesService.getStatusFromID(2); // TODO: ENUM FOR STATUS, 2 = Requested
      console.log(this.cardItem);
      this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(res => {
        if (res.message === 'success') {
          this.showModal = false;
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
    this.showModalChange.emit(false);
  }

  displayUser(user?: User) {
    return user ? user.username : '';
  }

}
