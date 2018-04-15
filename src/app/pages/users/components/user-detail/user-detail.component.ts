import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { User } from '../../../../datamodels/user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

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

  userItem: User = null;

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService
  ) {
    this.modalService.detailUser.subscribe((user) => {
      if (user && user.id) {
        this.userItem = user;
        this._showModal = true;
      }
    });

  }
  ngOnInit() {
  }

  /**
   * Closes form.
   */
  closeForm() {
    this.detailForm.resetForm();

    this.userItem = Object.assign({}, new User());
    this.modalService.detailUser.next(this.userItem);

    this.showModal = false;
  }
}
