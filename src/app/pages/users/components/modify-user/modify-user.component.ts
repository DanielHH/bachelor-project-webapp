import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss']
})
export class ModifyUserComponent implements OnInit, OnDestroy {
  nameInput = '';
  emailInput = '';
  usernameInput = '';
  passwordInput = '';
  confirmPasswordInput = '';
  isAdmin = false;
  changePassword = false;

  nameControl = new FormControl('', Validators.required);
  emailControl = new FormControl('', Validators.required);
  usernameControl = new FormControl('', Validators.required);
  passwordControl = new FormControl('', Validators.required);
  confirmPasswordControl = new FormControl('', Validators.required);

  userList = [];

  userToEdit: User;

  @Input() modalTitle = '';

  @Input() modalType: number;

  @ViewChild('modifyForm') modifyForm: NgForm;

  @Input() showModal = false;

  @Output() showModalChange = new EventEmitter<any>();

  get _showModal() {
    return this.showModal;
  }

  set _showModal(value: any) {
    if (!value) {
      this.closeForm();
    }
    this.showModal = value;
  }

  dataServiceSubscriber: any;

  modalServiceSubscriber: any;

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService
  ) {
    this.dataServiceSubscriber = this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });

    this.modalServiceSubscriber = this.modalService.editUser.subscribe(user => {
      if (user && user.id) {
        this.userToEdit = user;

        this.nameInput = user.name;
        this.usernameInput = user.username;
        this.emailInput = user.email;
        this.nameInput = user.name;
        this.isAdmin = utilitiesService.isAdmin(user);

        this.modalType = 1;
        this.modalTitle = 'Ändra användare';

        this._showModal = true;
      } else {
        this.userToEdit = null;

        this.modalType = 0;
        this.modalTitle = 'Lägg till ny användare';

        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();

    this.modalServiceSubscriber.unsubscribe();
  }

  /**
   * Sets fields in user according to form
   * @param user User to set form data to
   */
  setUserFromForm(user: User) {
    if (this.isValidInput()) {
      user.name = this.nameInput;
      user.email = this.emailInput;
      user.username = this.usernameInput;

      const userTypeID = this.isAdmin ? Number(1) : Number(2);
      user.userType = this.utilitiesService.getUserTypeFromID(userTypeID);

      user.modifiedDate = this.utilitiesService.getLocalDate();

      if (this.modalType === 0 || this.changePassword) {
        user.password = btoa(this.passwordInput);
      }
    }
  }

  /**
   * Attempts to submit new user to database
   */
  addNewUser() {
    if (this.isValidInput()) {
      const newUser = new User();

      this.setUserFromForm(newUser);

      newUser.creationDate = this.utilitiesService.getLocalDate();
      newUser.status = this.utilitiesService.getStatusFromID(5); // Status = active

      this.httpService.httpPost<User>('addNewUser/', newUser).then(res => {
        if (res.message === 'success') {
          this.dataService.getUserList();

          this.closeForm();
        }
      });
    }
  }

  /**
   * Attempts to submit edited user to database
   */
  editUser() {
    if (this.isValidInput()) {
      this.setUserFromForm(this.userToEdit);

      this.httpService.httpPut<User>('updateUser/', this.userToEdit).then(res => {
        if (res.message === 'success') {
          this.dataService.getUserList();

          this.closeForm();
        }
      });
    }
  }

  updatePasswordControl() {
    // Updates too fast I think, works with delay
    setTimeout(() => {
      this.passwordControl.updateValueAndValidity();
      this.confirmPasswordControl.updateValueAndValidity();
    }, 500);
  }

  /**
   * Returns true if entered name is valid, else false.
   */
  isValidName() {
    return !this.nameControl.hasError('required');
  }

  /**
   * Returns true if entered email address is valid, else false.
   */
  isValidEmail() {
    return !this.emailControl.hasError('required');
  }

  /**
   * Returns true if entered username is valid, else false.
   */
  isValidUsername() {
    return !this.usernameControl.hasError('required') && !this.usernameControl.hasError('newUsername');
  }

  /**
   * Returns true if entered password is valid, else false.
   */
  isValidPassword() {
    if (this.modalType === 1 && !this.changePassword) {
      return true;
    }

    return (
      !this.passwordControl.hasError('required') &&
      !this.passwordControl.hasError('password') &&
      !this.confirmPasswordControl.hasError('required') &&
      !this.confirmPasswordControl.hasError('confirmPassword')
    );
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return this.isValidName() && this.isValidEmail() && this.isValidUsername() && this.isValidPassword();
  }

  /**
   * Closes form. Also resets form by resetting form controls and clearing inputs
   */
  closeForm() {
    this.nameControl.reset();
    this.emailControl.reset();
    this.usernameControl.reset();
    this.passwordControl.reset();
    this.confirmPasswordControl.reset();

    this.isAdmin = false;
    this.changePassword = false;

    this.modifyForm.resetForm();

    this.userToEdit = Object.assign({}, new User());

    this.showModal = false;
    this.showModalChange.emit(false);
  }
}
