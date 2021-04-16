import {Component, Input, OnInit} from '@angular/core';
import {OrderItem} from '../../../_models/order-item';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent implements OnInit {
  @Input() item: OrderItem;

  constructor() {
  }

  ngOnInit() {
  }

}
