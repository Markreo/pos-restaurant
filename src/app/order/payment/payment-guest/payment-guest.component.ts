import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {Guest} from '../../../_models/guest';

@Component({
  selector: 'app-payment-guest',
  templateUrl: './payment-guest.component.html',
  styleUrls: ['./payment-guest.component.scss'],
})
export class PaymentGuestComponent implements OnInit {
  @Input() guest: Guest;
  @Output() guestChange = new EventEmitter<Guest>();

  constructor(private barcodeScanner: BarcodeScanner) {
  }

  ngOnInit() {
  }

  removeGuest() {

  }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      console.log('Error', err);
    });
  }


}
