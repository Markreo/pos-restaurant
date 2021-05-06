import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Menu} from '../_models/menu';
import {HttpClient} from '@angular/common/http';
import {buildInventoryUrl, buildUrl} from '../_helpers/functions';

@Injectable({providedIn: 'root'})
export class MenuService {
  constructor(private http: HttpClient) {
  }

  getListCategoriesByMenu(menuId): Observable<Menu[]> {
    return this.http.get<Menu[]>(buildInventoryUrl('menus') + '/' + menuId + '/categories');
  }

  getMenuByLocation(locationId) {
    return this.http.get<{data: Menu[], total: number}>(buildInventoryUrl('store-locations/') + locationId + '/menus');
  }
}
