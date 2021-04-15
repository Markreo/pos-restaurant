import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Table} from '../../_models/table';
import {OrderService} from '../../_services/order.service';
import {Subject} from 'rxjs';
import {debounceTime, filter, switchMap} from 'rxjs/operators';
import {GolfClubEntity} from '../../_models/golf-club.entity';
import {Order} from '../../_models/order';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnChanges {
  @Input() table: Table;
  @Input() golfClub: GolfClubEntity;
  orderSubject = new Subject<Table>();
  loadingOrder = true;
  order: Order;

  constructor(private orderService: OrderService) {
    this.subscribeGetOrder();
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
      console.log('err', error);
      this.loadingOrder = false;
    });
  }

  initNewOrder() {
this.order = new Order()
  }

}
