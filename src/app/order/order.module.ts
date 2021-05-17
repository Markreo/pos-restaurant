import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {OrderPageRoutingModule} from './order-routing.module';
import {OrderPage} from './order.page';
import {ListProductsComponent} from './list-products/list-products.component';
import {ChildListProductsComponent} from './list-products/child-list-products/child-list-products.component';
import {PaymentComponent} from './payment/payment.component';
import {OrderItemComponent} from './payment/order-item/order-item.component';
import {ProductItemComponent} from './list-products/product-item/product-item.component';
import {SharedModule} from '../_helpers/shared/shared.module';
import {PaymentGuestComponent} from './payment/payment-guest/payment-guest.component';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {ListGuestComponent} from './payment/payment-guest/list-guest/list-guest.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule,
    SharedModule,
  ],
  providers: [BarcodeScanner],
  declarations: [OrderPage,
    ListProductsComponent,
    ListGuestComponent,
    ChildListProductsComponent,
    PaymentComponent,
    OrderItemComponent,
    ProductItemComponent,
    PaymentGuestComponent]
})
export class OrderPageModule {
}
