import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss']
})
export class AddNewCardComponent implements OnInit {

  newCard = new Card();

  cardTypeControl = new FormControl('', [Validators.required]);

  cardTypes = [
    {name: 'Type 1', description: 'Type 1 description'},
    {name: 'Type 2', description: 'Type 2 description'},
    {name: 'Type 3', description: 'Type 3 description'},
    {name: 'Type 4', description: 'Type 4 description'},
  ];

  constructor(private httpService: HttpService) { }

  ngOnInit() {
  }

  addNewCard() {
    this.httpService.httpPost<Card>('addNewCard/', this.newCard).then(data => {

      console.log(data);

    });
  }

}
