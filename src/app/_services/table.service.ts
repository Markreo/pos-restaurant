import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Table} from '../_models/table';
import {buildUrl} from '../_helpers/functions';

@Injectable({providedIn: 'root'})
export class TableService {
  constructor(private http: HttpClient) {
  }

  getAll(golfId, location) {
    return this.http.get<Table[]>(buildUrl(`golf/clubs/${golfId}/tables?location=${location}`));
  }
}
