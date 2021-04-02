import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, delay, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {buildUrl} from '../_helpers/functions';
import {LocationService} from './location.service';
import {GolfClubService} from './golf-club.service';
import {TableService} from './table.service';
import {LoadingController} from '@ionic/angular';

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private http: HttpClient,
              private locationService: LocationService,
              private golfClubService: GolfClubService,
              private tableService: TableService,
              private storage: Storage,
              private loadingController: LoadingController,
              private router: Router) {
  }


  login(loginData: { username: string, password: string }) {
    return this.http.post<any>(buildUrl('auth/token'), {
      username: loginData.username,
      password: loginData.password,
    }).pipe(
      catchError(error => {
          if (error.status === 401) {
            return throwError('message_login_failure');
          }
          return throwError('other error: ' + error.status);
        }
      ),
      tap((resp) => {
        this.setLoggedData(resp);
      }),
      delay(100) // make sure save login data success
    );
  }

  async setLoggedData(resp) {
    const {access_token, ...loginData} = resp;
    await this.storage.set('TOKEN', access_token);
    await this.storage.set('login_data', loginData);
  }

  isLogged(): Promise<any> {
    return this.storage.get('login_data');
  }

  async logout() {
    this.loadingController.dismiss();
    this.tableService.clean();
    this.golfClubService.clean();
    this.locationService.clean();
    await this.storage.remove('TOKEN');
    await this.storage.remove('login_data');
    await this.router.navigate(['/login']);
  }

  getToken(): Promise<string> {
    return this.storage.get('TOKEN');
  }
}
