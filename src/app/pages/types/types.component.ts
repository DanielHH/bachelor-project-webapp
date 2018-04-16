import { Component, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../datamodels/card';
import { ModifyTypeComponent } from './components/modify-type/modify-type.component';
import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';

import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { CardType } from '../../datamodels/cardType';
import { DocumentType } from '../../datamodels/documentType';
import { BaseType } from '../../datamodels/baseType';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  typeList: BaseType[] = [];

  constructor(
    public dataService: DataService
  ) {
    this.dataService.typeList.subscribe((typeList) => {
      this.typeList = typeList;
    });

  }

  ngOnInit() {
  }

}
