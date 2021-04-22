import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Table} from '../../_models/table';
import {OrderService} from '../../_services/order.service';
import {Subject} from 'rxjs';
import {debounceTime, filter, switchMap} from 'rxjs/operators';
import {GolfClubEntity} from '../../_models/golf-club.entity';
import {Order} from '../../_models/order';
import {OrderItem} from '../../_models/order-item';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnChanges {
  @Input() table: Table;
  @Input() golfClub: GolfClubEntity;
  orderSubject = new Subject<Table>();
  loadingOrder = true;
  order: Order;

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.subscribeGetOrder();
    this.orderService.watchAddVariant().subscribe(variant => {
      console.log('here');
      const existing = this.getExistingVariants(variant);
      if (existing.length) {
        existing.forEach(existingItem => {
          existingItem.quantity += 1;
        });
      } else {
        this.addVariant(variant);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.table) {
      this.orderSubject.next(this.table);
    }
  }

  subscribeGetOrder() {
    this.orderSubject.pipe(
      debounceTime(300),
      filter(table => !!table),
      switchMap(table => {
        this.loadingOrder = true;
        return this.orderService.getOrder(this.golfClub.id, table.id);
      })
    ).subscribe(order => {
      this.loadingOrder = false;
      if (order) {
        this.order = new Order(order);
      } else {
        this.initNewOrder();
      }
    }, error => {
      this.loadingOrder = false;
    });
  }

  initNewOrder() {
    this.order = new Order();
  }

  addVariant(variant) {
    console.log('addVariant');
    this.order.items.push(new OrderItem({
      quantity: 1,
      price: variant.sale_price,
      variant,
      discount: variant.discount ? variant.discount.discount : 0,
      discount_type: variant.discount ? variant.discount.type : 'PERCENTAGE'
    }));
    console.log(this.order.items);
  }


  getExistingVariants(variant): OrderItem[] {
    return this.order.items.filter(item => item.variant.id === variant.id && !item.id && !item.is_voucher && !item.guest);
  }
}
