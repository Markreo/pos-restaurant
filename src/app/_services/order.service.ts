import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {buildInventoryUrl} from '../_helpers/functions';
import {Subject} from 'rxjs';
import {Variant} from '../_models/variant';

@Injectable({providedIn: 'root'})
export class OrderService {
  variantSubject = new Subject();

  constructor(private http: HttpClient) {
  }

  getOrder(golfClubId, tableId) {
    return this.http.get(buildInventoryUrl('/golf/clubs/' + golfClubId) + '/orders?table=' + tableId);
  }

  triggerAddVariant(variant: Variant) {
    this.variantSubject.next(variant);
  }

  watchAddVariant() {
    return this.variantSubject.asObservable();
  }
}
