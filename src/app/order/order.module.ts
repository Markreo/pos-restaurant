import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import {ListProductsComponent} from './list-products/list-products.component';
import {ChildListProductsComponent} from './list-products/child-list-products/child-list-products.component';
import {PaymentComponent} from './payment/payment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule
  ],
  declarations: [OrderPage, ListProductsComponent, ChildListProductsComponent, PaymentComponent]
})
export class OrderPageModule {}
