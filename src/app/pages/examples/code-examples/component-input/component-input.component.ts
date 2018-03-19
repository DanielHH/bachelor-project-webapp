import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-input',
  templateUrl: './component-input.component.html',
  styleUrls: ['./component-input.component.scss']
})
export class ComponentInputComponent implements OnInit {

  testVariable = '';

  constructor() { }

  ngOnInit() {
  }

}
