import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {buildInventoryUrl, convertDataToServer} from '../_helpers/functions';
import {Subject} from 'rxjs';
import {Variant} from '../_models/variant';
import {Order} from '../_models/order';

@Injectable({providedIn: 'root'})
export class OrderService {
  variantSubject = new Subject();

  constructor(private http: HttpClient) {
  }

  getOrder(golfClubId, tableId) {
    return this.http.get<Order>(buildInventoryUrl('/golf/clubs/' + golfClubId) + '/orders?table=' + tableId);
  }

  triggerAddVariant(variant: Variant) {
    this.variantSubject.next(variant);
  }

  watchAddVariant() {
    return this.variantSubject.asObservable();
  }

  createOrder(golfClubId, data) {
    return this.http.post<Order>(buildInventoryUrl('/golf/clubs/' + golfClubId) + '/orders', convertDataToServer(data));
  }

  updateOrder(golfClubId, orderId, data) {
    return this.http.put<Order>(buildInventoryUrl('/golf/clubs/' + golfClubId) + '/orders/' + orderId, convertDataToServer(data));
  }

  checkout(orderId, data) {
    return this.http.put<any>(buildInventoryUrl('orders/' + orderId + '/checkout'), data);
  }

}
