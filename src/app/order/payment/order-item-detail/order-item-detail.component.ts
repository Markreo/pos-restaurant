import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {OrderItem} from '../../../_models/order-item';
import {GuestService} from '../../../_services/guest.service';
import {GolfClubService} from '../../../_services/golf-club.service';
import {ModalController, ToastController} from '@ionic/angular';
import {OrderService} from '../../../_services/order.service';

@Component({
  selector: 'app-order-item-detail',
  templateUrl: './order-item-detail.component.html',
  styleUrls: ['./order-item-detail.component.scss'],
})
export class OrderItemDetailComponent implements OnInit {
  @Input() item: OrderItem;
  @Output() updateItem: (data) => void;
  @Output() removeItem: () => void;

  @ViewChild('inputQty') inputQtyRef: ElementRef;
  @ViewChild('inputPrice') inputPriceRef: ElementRef;
  @ViewChild('inputDescription') inputDescriptionRef: ElementRef;
  @ViewChild('inputDiscountType') inputDiscountTypeRef: ElementRef;
  @ViewChild('inputBagtag') inputBagtagRef: ElementRef;

  focusKey;
  keyBagtag = '';
  loadingGuest = false;

  constructor(private guestService: GuestService,
              private orderService: OrderService,
              private modalController: ModalController,
              private toastController: ToastController,
              private golfClubService: GolfClubService) {
  }

  ngOnInit() {
    console.log('this.item', this.item);
  }

  increase(e) {
    this.item.quantity += 1;
    e.preventDefault();
    e.stopPropagation();
    this.inputQtyRef.nativeElement.focus();
  }

  decrease(e) {
    if (this.item.quantity > 1) {
      this.item.quantity -= 1;
    }
    e.preventDefault();
    e.stopPropagation();
    this.inputQtyRef.nativeElement.focus();
  }

  toggleDiscountType(e) {
    this.item.discount_type = (this.item.discount_type === 'FIXED' ? 'PERCENTAGE' : 'FIXED');
    e.preventDefault();
    e.stopPropagation();
    this.inputDiscountTypeRef.nativeElement.focus();
  }

  markFocus(key) {
    this.focusKey = key;
  }


  markApplyVoucher() {
    this.item.is_voucher = true;
    if (this.focusKey && this[this.focusKey + 'Ref']) {
      this[this.focusKey + 'Ref'].nativeElement.focus();
    }
  }

  applyBagtag(e) {
    e.preventDefault();
    e.stopPropagation();
    this.loadingGuest = true;
    if (this.inputBagtagRef) {
      this.inputBagtagRef.nativeElement.focus();
    }
    const golfClubId = this.golfClubService.currentGolfClub ? this.golfClubService.currentGolfClub.id : '';
    this.guestService.getAllWithFilter(golfClubId, {search: this.keyBagtag}).subscribe(({data}) => {
      this.loadingGuest = false;
      if (data && data.length) {
        this.item.guest = data[0];
        this.presentToast('Apply success!', 'success');
      } else {
        this.presentToast('Guest not found!', 'danger');
      }
    }, error => {
      this.loadingGuest = false;
      console.log('error', error);
      this.presentToast('Guest not found!', 'danger');
    });
  }

  removeGuest() {
    this.item.guest = null;
  }


  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    await toast.present();
  }

  onClickSave() {
    // this.itemChange.emit(this.item);
    this.updateItem(this.item);
    this.modalController.dismiss();
  }

  remove() {
    this.removeItem();
    this.modalController.dismiss();
  }
}
