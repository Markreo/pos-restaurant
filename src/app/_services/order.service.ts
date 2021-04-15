import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {buildInventoryUrl, buildUrl} from '../_helpers/functions';

@Injectable({providedIn: 'root'})
export class OrderService {
  constructor(private http: HttpClient) {
  }

  getOrder(golfClubId, tableId) {
    return this.http.get(buildInventoryUrl('/golf/clubs/' + golfClubId) + '/orders?table=' + tableId);
  }
}
