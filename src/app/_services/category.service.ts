import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {buildInventoryUrl} from '../_helpers/functions';
import {Category} from '../_models/category';

@Injectable({providedIn: 'root'})
export class CategoryService {

  constructor(private http: HttpClient) {

  }

  getAll(locationId) {
    return this.http.get<Category[]>(buildInventoryUrl('store-locations/' + locationId + '/product-categories'));
  }
}
