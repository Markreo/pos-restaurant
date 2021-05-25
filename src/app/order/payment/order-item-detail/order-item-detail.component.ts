import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OrderItem} from '../../../_models/order-item';

@Component({
  selector: 'app-order-item-detail',
  templateUrl: './order-item-detail.component.html',
  styleUrls: ['./order-item-detail.component.scss'],
})
export class OrderItemDetailComponent implements OnInit {
  @Input() item: OrderItem;
  @ViewChild('inputQty') inputQtyRef: ElementRef;
  @ViewChild('inputPrice') inputPriceRef: ElementRef;
  @ViewChild('inputDescription') inputDescriptionRef: ElementRef;
  @ViewChild('inputDiscountType') inputDiscountTypeRef: ElementRef;

  focusKey;

  constructor() {
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
    if (this.focusKey) {
      this[this.focusKey + 'Ref'].nativeElement.focus();
    }
  }
}
