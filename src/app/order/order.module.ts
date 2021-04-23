import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import {ListProductsComponent} from './list-products/list-products.component';
import {ChildListProductsComponent} from './list-products/child-list-products/child-list-products.component';
import {PaymentComponent} from './payment/payment.component';
import {OrderItemComponent} from './payment/order-item/order-item.component';
import {ProductItemComponent} from './list-products/product-item/product-item.component';
import {SharedModule} from '../_helpers/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule,
    SharedModule
  ],
  declarations: [OrderPage, ListProductsComponent, ChildListProductsComponent, PaymentComponent, OrderItemComponent, ProductItemComponent]
})
export class OrderPageModule {}
