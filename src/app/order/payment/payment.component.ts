import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Table} from '../../_models/table';
import {OrderService} from '../../_services/order.service';
import {Subject} from 'rxjs';
import {debounceTime, filter, switchMap} from 'rxjs/operators';
import {GolfClubEntity} from '../../_models/golf-club.entity';
import {Order} from '../../_models/order';
import {OrderItem} from '../../_models/order-item';
import {LoadingController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnChanges {
  @Input() table: Table;
  @Input() golfClub: GolfClubEntity;
  orderSubject = new Subject<Table>();
  loading = 'loadingOrder';
  order: Order;

  constructor(private orderService: OrderService, private loadingControl: LoadingController,
              private toastController: ToastController) {
  }

  ngOnInit() {
    this.subscribeGetOrder();
    this.orderService.watchAddVariant().subscribe(variant => {
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
        this.loading = 'loadingOrder';
        return this.orderService.getOrder(this.golfClub.id, table.id);
      })
    ).subscribe(order => {
      this.loading = undefined;
      if (order && order.id) {
        this.order = new Order(order);
      } else {
        this.initNewOrder();
      }
    }, error => {
      this.loading = undefined;
    });
  }

  initNewOrder() {
    this.order = new Order({
      table_map: this.table
    });
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

  async submitOrder() {
    const loading = await this.presentLoading();
    if (this.order.id) {
      this.orderService.updateOrder(this.golfClub.id, this.order.id, this.order)
        .subscribe(this.onSubmitOrderSuccess(loading), this.onSubmitOrderSuccess(loading));
    } else {
      this.orderService.createOrder(this.golfClub.id, this.order)
        .subscribe(this.onSubmitOrderSuccess(loading), this.onSubmitOrderSuccess(loading));
    }
  }

  onSubmitOrderSuccess = (loading: HTMLIonLoadingElement) => {
    return (order: Order) => {
      this.order = order;
      loading.dismiss();
      this.presentToast('success', 'Submit order success!');
    };
  };

  onSubmitError = (loading: HTMLIonLoadingElement) => {
    return (error) => {
      // show error
      loading.dismiss();
      this.presentToast('danger', 'Something error!');
    };
  };


  async presentLoading() {
    const loading = await this.loadingControl.create({
      spinner: 'circular',
      message: 'Submit order...',
      translucent: false,
    });
    await loading.present();
    return loading;
  }

  async presentToast(color, message) {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
      color
    });
    toast.present();
  }

}
