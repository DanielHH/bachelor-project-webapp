import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-output-test',
  templateUrl: './output-test.component.html',
  styleUrls: ['./output-test.component.scss']
})
export class OutputTestComponent implements OnInit {

  testVariable = '';

  @Output() outputVariable = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  inputChange() {
    this.outputVariable.emit(this.testVariable);
  }

}
