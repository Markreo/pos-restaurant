import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Table} from '../../_models/table';
import {OrderService} from '../../_services/order.service';
import {Subject} from 'rxjs';
import {debounceTime, filter, switchMap} from 'rxjs/operators';
import {GolfClubEntity} from '../../_models/golf-club.entity';
import {Order} from '../../_models/order';
import {OrderItem} from '../../_models/order-item';
import {ActionSheetController, AlertController, LoadingController, ToastController} from '@ionic/angular';
import {Guest} from '../../_models/guest';

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

  constructor(private orderService: OrderService,
              private loadingControl: LoadingController,
              private toastController: ToastController,
              private alertController: AlertController,
              private actionSheetController: ActionSheetController) {
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
    this.order.items.push(new OrderItem({
      quantity: 1,
      price: variant.sale_price,
      variant,
      discount: variant.discount ? variant.discount.discount : 0,
      discount_type: variant.discount ? variant.discount.type : 'PERCENTAGE'
    }));
  }


  getExistingVariants(variant): OrderItem[] {
    return this.order.items.filter(item => item.variant.id === variant.id && !item.id && !item.is_voucher && !item.guest);
  }

  async submitOrder() {
    const {role} = await this.presentAlert(`Do you want to ${this.order.id ? 'Update' : 'Submit'} order?`,
      [
        {text: 'Cancel', role: 'Cancel'},
        {text: 'OK', role: 'OK'}
      ]);
    if (role === 'OK') {
      const loading = await this.presentLoading();
      if (this.order.id) {
        this.orderService.updateOrder(this.golfClub.id, this.order.id, this.order)
          .subscribe(this.onSubmitOrderSuccess(loading), this.onSubmitOrderSuccess(loading));
      } else {
        this.orderService.createOrder(this.golfClub.id, this.order)
          .subscribe(this.onSubmitOrderSuccess(loading), this.onSubmitOrderSuccess(loading));
      }
    }
  }

  async checkoutOrder() {
    if (!this.checkGuestValidator()) {
      await this.presentAlert('Guest cannot be null!');
      return;
    }

    const {role} = await this.presentAlert('Do you want to checkout?', [{text: 'Cancel', role: 'Cancel'}, {text: 'OK', role: 'OK'}]);
    if (role === 'OK') {
      const loading = await this.presentLoading();
      this.orderService.checkout(this.order.id, {
        lang: 'en',
        items: this.order.items.map(item => {
          return {
            id: item.id,
            variant: item.variant ? item.variant.id : null,
            quantity: item.quantity,
            price: item.price
          };
        })
      }).subscribe(order => {
        this.presentToast('primary', 'Checkout success!');
        this.initNewOrder();
        loading.dismiss();
      }, error => {
        loading.dismiss();
      });
    }
  }

  async presentAlert(message, btns: any[] = ['OK']) {
    const alert = await this.alertController.create({
      message,
      buttons: btns
    });
    await alert.present();
    return await alert.onDidDismiss();
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

  async presentActionSheet() {
    if (this.order.id) {
      const actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Update Order',
            handler: () => {
              this.submitOrder();
            }
          },
          {
            text: 'Checkout Order',
            handler: () => {
              this.checkoutOrder();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      await actionSheet.present();
    } else {
      await this.submitOrder();
    }

  }

  setGuest(guest: Guest) {
    this.order.guest = guest;
  }

  checkGuestValidator(): boolean {
    const itemWithoutBagtag = this.order.items.find(item => !item.guest);
    if (itemWithoutBagtag) {
      return !!this.order.guest;
    } else {
      return true;
    }
  }

  remove(index) {
    this.order.items.splice(index, 1);
  }

  updateItem(index, newItem) {
    this.order.items[index] = newItem;
  }
}
