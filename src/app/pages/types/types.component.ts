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

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardTypeList.subscribe((cardTypeList) => {
      this.cardTypeList = cardTypeList;
    });

    this.dataService.documentTypeList.subscribe((documentTypeList) => {
      this.documentTypeList = documentTypeList;
    });

  }

  ngOnInit() {
  }

}
