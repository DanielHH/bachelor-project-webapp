import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-variable-binding',
  templateUrl: './variable-binding.component.html',
  styleUrls: ['./variable-binding.component.scss']
})
export class VariableBindingComponent implements OnInit {

  testVariable = '';

  constructor() { }

  ngOnInit() {
  }

}
