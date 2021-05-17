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
    this.barcodeScanner.scan().then(barcodeData => {
      this.loading = true;
      this.guestService.getAllWithFilter(this.golfClub.id, barcodeData).subscribe(({data}) => {
        this.loading = false;
        if (data) {
          this.onClickGuest(this.guest);
        }
      }, error => {
        this.loading = false;
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

  onClickGuest(guest: Guest) {
    this.guest = guest;
    this.guestChange.emit(this.guest);
    this.showResult = false;
    this.guests = [];
  }

}
