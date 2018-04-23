import { Component, OnInit } from '@angular/core';
import { Card } from '../../datamodels/card';
import { Document } from '../../datamodels/document';
import { DataService } from '../../services/data.service';
import { BaseItem } from '../../datamodels/baseItem';
import { UtilitiesService } from '../../services/utilities.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

}
