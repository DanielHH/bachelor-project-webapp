import { Component, OnInit } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss']
})
export class AddNewCardComponent implements OnInit {

  newCard = new Card();

  constructor(private httpService: HttpService) { }

  ngOnInit() {
  }

  addNewCard() {
    this.newCard.userID = 1;
    this.newCard.user = 'Niklas';
    this.newCard.location = 'Zimbabwe';
    this.newCard.comment = 'Varför är han där?';
    this.newCard.expirationDate = new Date();

    this.httpService.httpPost<Card>('addNewCard/', this.newCard).then(data => {

      console.log(data);

    });
  }

}
