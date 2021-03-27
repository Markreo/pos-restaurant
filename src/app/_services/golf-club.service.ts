import {Injectable} from '@angular/core';
import {GolfClubEntity} from '../_models/golf-club.entity';
import {Storage} from '@ionic/storage';
import {from, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {buildUrl} from '../_helpers/functions';

@Injectable({providedIn: 'root'})
export class GolfClubService {
  currentGolfClub: GolfClubEntity;

  constructor(private storage: Storage, private http: HttpClient) {
  }

  getCurrentGolfClub(): Observable<GolfClubEntity> {
    if (this.currentGolfClub) {
      return of(this.currentGolfClub);
    } else {
      return from(this.storage.get('golf-club')).pipe(
        tap(club => this.currentGolfClub = club)
      );
    }
  }


  getAllByUser() {
    return this.http.get(buildUrl('golf/clubs'));
  }


  setCurrentGolfClub(golfClub) {
    if (golfClub) {
      this.storage.set('golf-club', {
        id: golfClub.id,
        name: golfClub.name
      });
      this.currentGolfClub = golfClub;
    }
  }
}
