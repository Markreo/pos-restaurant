import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {Guest} from '../../../_models/guest';
import {GuestService} from '../../../_services/guest.service';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {GolfClubEntity} from '../../../_models/golf-club.entity';

@Component({
  selector: 'app-payment-guest',
  templateUrl: './payment-guest.component.html',
  styleUrls: ['./payment-guest.component.scss'],
})
export class PaymentGuestComponent implements OnInit {
  @Input() guest: Guest;
  @Input() golfClub: GolfClubEntity;
  @Input() disabled: boolean;
  @Output() guestChange = new EventEmitter<Guest>();

  searchStr = '';
  loading = true;
  guests = [];
  showResult = false;


  guestSubject = new Subject<{ search: string }>();

  constructor(private barcodeScanner: BarcodeScanner, private guestService: GuestService) {
  }

  ngOnInit() {
    this.subscribeGuest();
  }

  subscribeGuest() {
    this.guestSubject.pipe(
      debounceTime(300),
      switchMap(filter => {
        this.loading = true;
        return this.guestService.getAllWithFilter(this.golfClub.id, filter);
      })
    ).subscribe(({total, data}) => {
      this.loading = false;
      this.guests = data;
    }, error => {
      this.loading = false;
    });
  }

  removeGuest() {
    this.guest = null;
    this.searchStr = '';
    this.guestChange.emit(null);
  }

  update() {
    this.guestSubject.next({search: this.searchStr});
  }

  scanBarcode() {
    if (this.disabled) {
      return;
    }
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('barcodeData', barcodeData);
      this.loading = true;
      this.guestService.getAllWithFilter(this.golfClub.id, {search: barcodeData.text}).subscribe(({data}) => {
        console.log('data', data);
        this.loading = false;
        if (data && data.length) {
          this.onClickGuest(data[0]);
        }
      }, error => {
        this.loading = false;
        console.log('error', error);
      });
    }).catch(err => {
      console.log('Error', err);
    });
  }

  handleFocus(event) {
    this.showResult = true;
    this.loading = true;
    this.update();
  }

  handleBlur() {
    setTimeout(() => {
      if (this.searchStr.trim() === '') {
        this.showResult = false;
      }
    }, 200);
  }

  onClickGuest(guest: Guest) {
    this.guest = guest;
    this.searchStr = '';
    this.guestChange.emit(this.guest);
    this.showResult = false;
    this.guests = [];
  }

}
