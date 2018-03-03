import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.scss']
})
export class ItemMenuComponent implements OnInit {

  // Card or Document
  @Input() item: any;

  constructor() { }

  ngOnInit() {
  }

}
