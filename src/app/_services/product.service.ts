import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../_models/product';
import {buildInventoryUrl} from '../_helpers/functions';

@Injectable({providedIn: 'root'})
export class ProductService {
  constructor(private http: HttpClient) {
  }

  getAllWithFilter(locationId, filter) {
    return this.http.get<{ total: number, data: Product[] }>(buildInventoryUrl('stores/' + locationId + '/products') + `?start=${filter.start}&max=${filter.max}`);
  }
}
