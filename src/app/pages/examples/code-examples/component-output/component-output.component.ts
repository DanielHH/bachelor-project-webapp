import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-output',
  templateUrl: './component-output.component.html',
  styleUrls: ['./component-output.component.scss']
})
export class ComponentOutputComponent implements OnInit {

  testVariable = '';

  constructor() { }

  ngOnInit() {
  }

}
