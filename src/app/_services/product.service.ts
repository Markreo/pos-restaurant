import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../_models/product';
import {buildInventoryUrl} from '../_helpers/functions';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Variant} from '../_models/variant';

@Injectable({providedIn: 'root'})
export class ProductService {
  constructor(private http: HttpClient) {
  }

  getAllWithFilter(locationId, filter) {
    return this.http.get<{ total: number, data: Product[] }>(buildInventoryUrl('stores/' + locationId + '/products') + `?start=${filter.start}&max=${filter.max}`);
  }

  getVariants(productId): Observable<Variant[]> {
    return this.http.get(buildInventoryUrl('/products') + '/' + productId).pipe(
      map((product: Product) => {
        return product.variants || [];
      })
    );
  }
}
