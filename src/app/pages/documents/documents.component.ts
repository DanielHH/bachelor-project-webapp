import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../../datamodels/document';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  constructor() {}

  ngOnInit() {}
}
