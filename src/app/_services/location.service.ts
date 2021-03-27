import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {from, Observable, of} from 'rxjs';
import {LocationEntity} from '../_models/location.entity';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {buildUrl} from '../_helpers/functions';

@Injectable({providedIn: 'root'})
export class LocationService {
  currentLocation: LocationEntity;

  constructor(private storage: Storage, private http: HttpClient) {
  }

  getCurrentLocation(): Observable<LocationEntity> {
    if (this.currentLocation) {
      return of(this.currentLocation);
    } else {
      this.storage.get('location').then(location => {
      });
      return from(this.storage.get('location')).pipe(
        tap(location => this.currentLocation = location)
      );
    }
  }

  getAllByClub(clubId) {
    return this.http.get<LocationEntity[]>(buildUrl(`golf/clubs/${clubId}/store-locations`));
  }

  setLocation(location) {
    this.currentLocation = location;
    this.storage.set('location', {id: location.id, name: location.name});
  }
}
