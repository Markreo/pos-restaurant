import {Component, Input, OnInit} from '@angular/core';
import {OrderItem} from '../../../_models/order-item';

@Component({
  selector: 'app-order-item-detail',
  templateUrl: './order-item-detail.component.html',
  styleUrls: ['./order-item-detail.component.scss'],
})
export class OrderItemDetailComponent implements OnInit {
  @Input() item: OrderItem;

  constructor() {
  }

  ngOnInit() {
    console.log('this.item', this.item);
  }

  increase() {
    this.item.quantity += 1;
  }

  decrease() {
    if (this.item.quantity > 1) {
      this.item.quantity -= 1;
    }
  }

}
