import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../_models/product';
import {buildInventoryUrl} from '../_helpers/functions';
import {map} from 'rxjs/operators';
import {Observable, pipe} from 'rxjs';
import {Variant} from '../_models/variant';

@Injectable({providedIn: 'root'})
export class ProductService {
  constructor(private http: HttpClient) {
  }

  getAllWithFilter(locationId, filter: any = {}) {
    const {menu, ...otherFilter} = filter;
    const query = Object.keys(otherFilter).reduce((qry, key) => {
      if (filter[key]) {
        qry += '&' + key + '=' + filter[key];
      }
      return qry;
    }, '');
    if (menu) {
      return this.http.get<Product[]>(buildInventoryUrl('/store-locations/' + locationId + '/menus/' + menu + '/products?category=' + menu + '?' + query)).pipe(
        map(products => {
          return {
            total: products.length, data: products.map(product => {
              return {...product, sale_price: product.price, menu};
            })
          };
        })
      );
    } else {

      return this.http.get<{ total: number, data: Product[] }>(buildInventoryUrl('stores/' + locationId + '/products') + `?` + query);
    }
  }

  getVariants(productId): Observable<Variant[]> {
    return this.http.get(buildInventoryUrl('/products') + '/' + productId).pipe(
      map((product: Product) => {
        return product.variants || [];
      })
    );
  }
}
