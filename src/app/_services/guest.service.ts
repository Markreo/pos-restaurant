import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {buildUrl, getToday} from '../_helpers/functions';
import {Guest} from '../_models/guest';

@Injectable({providedIn: 'root'})
export class GuestService {
  constructor(private http: HttpClient) {
  }

  getAllWithFilter(golfClubId, filter) {
    return this.http.get<{ total, data: Guest[] }>(buildUrl('/golf/clubs/' + golfClubId) + `/guests?date=${getToday().getTime()}&status=CHECKIN,CHECKOUT&fields=id,bagtag&start=0&max=9999&search=${filter.search}`);
  }
}
