import { Component, OnInit } from '@angular/core';
import { BaseType } from '../../datamodels/baseType';
import { DataService } from '../../services/data.service';



@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {
  typeList: BaseType[] = [];

  constructor(public dataService: DataService) {
    this.dataService.typeList.subscribe(typeList => {
      this.typeList = typeList;
    });
  }

  ngOnInit() {}
}
