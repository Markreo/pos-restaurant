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

  getLocation(): Observable<LocationEntity> {
    if (this.currentLocation) {
      console.log('service location');
      return of(this.currentLocation);
    } else {
      console.log('load storage');
      this.storage.get('location').then(location => {
        console.log('location', location);
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
