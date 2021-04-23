import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Guest} from '../../../_models/guest';

@Component({
  selector: 'app-payment-guest',
  templateUrl: './payment-guest.component.html',
  styleUrls: ['./payment-guest.component.scss'],
})
export class PaymentGuestComponent implements OnInit {
  @Input() guest: Guest;
  @Output() guestChange = new EventEmitter<Guest>();

  constructor() {
  }

  ngOnInit() {
  }

  removeGuest() {

  }

}
