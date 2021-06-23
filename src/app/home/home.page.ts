import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableService} from '../_services/table.service';
import {GolfClubService} from '../_services/golf-club.service';
import {LocationService} from '../_services/location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Table} from '../_models/table';
import {LocationEntity} from '../_models/location.entity';
import {GolfClubEntity} from '../_models/golf-club.entity';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from '../_services/auth.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, delay, map, switchMap, takeUntil} from 'rxjs/operators';
import {WebsocketService} from '../websocket/websocket-service';
import {StompConfig} from '@stomp/ng2-stompjs';
import {environment} from '../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  locations: LocationEntity[] = [];
  golfClubs: GolfClubEntity[] = [];
  tables: Table[] = [];

  form: FormGroup = new FormGroup({
    golfClub: new FormControl(null, Validators.required),
    location: new FormControl(null, Validators.required),
    search: new FormControl(null)
  });
  loadingTable = true;
  getLocationSubscription: Observable<Location[]>;

  loadLocationSubject = new Subject<GolfClubEntity>();
  tableSubject = new Subject<string>();
  searchTable = '';
  initLocation = false;

  destroySubject = new Subject<boolean>();

  constructor(private tableService: TableService,
              private golfClubService: GolfClubService,
              private locationService: LocationService,
              private activated: ActivatedRoute,
              private loadingCtrl: LoadingController,
              private alertController: AlertController,
              private authService: AuthService,
              private websocket: WebsocketService,
              private translate: TranslateService,
              private auth: AuthService,
              private router: Router) {
    this.form.get('golfClub').valueChanges.subscribe(golfClub => {
      if (golfClub) {
        this.golfClubService.setCurrentGolfClub(golfClub);
        this.loadLocationSubject.next(golfClub);
      }
    });
    this.form.get('location').valueChanges.subscribe(location => {
      if (location) {
        this.searchTable = '';
        this.locationService.setLocation(location);
        this.tableSubject.next('');
      }
    });
  }

  ngOnInit() {
    this.subscribeLoadLocation();
    this.subscribeTable();
    this.ionViewDidEnter();
    this.subscribeWebsocket();
  }

  ionViewDidEnter() {
    this.golfClubService.getAllByUser().subscribe(golfClubs => {
      if (golfClubs && Array.isArray(golfClubs)) {
        this.golfClubs = golfClubs;
      }
      this.golfClubService.getCurrentGolfClub().pipe(
        delay(100)
      ).subscribe(currentGolfClub => {
        console.log('currentGolfClub', currentGolfClub);
        if (currentGolfClub) {
          this.form.get('golfClub').setValue(currentGolfClub);
        } else {
          if (golfClubs.length === 1) {
            this.golfClubService.setCurrentGolfClub(golfClubs[0]);
            this.form.get('golfClub').setValue(golfClubs[0]);
          } // else user select
        }
      });
    });
  }

  subscribeLoadLocation() {
    this.loadLocationSubject.pipe(
      switchMap(golfClub => {
        return this.locationService.getAllByClub(golfClub.id);
      })
    ).subscribe(locations => {
      console.log('location by club', locations);
      this.locations = locations;

      if (!this.initLocation) {

        this.initLocation = true;
        this.locationService.getCurrentLocation().subscribe(location => {
          if (location) {
            this.form.get('location').setValue(location);
          }
        });

        // setTimeout(() => {
        //   console.log('dissmiss');
        //   this.loadingCtrl.dismiss();
        // }, 500);
      }
    });
  }

  subscribeTable() {
    this.tableSubject.pipe(
      switchMap((search) => {
        this.loadingTable = true;
        return this.tableService.getAll(this.form.get('golfClub').value.id, this.form.get('location').value.id, search);
      })
    ).subscribe(tables => {
      this.loadingTable = false;
      this.tables = tables;
    }, error => {
      this.loadingTable = false;
    });
  }

  updateSearch() {
    this.tableSubject.next(this.searchTable);
  }

  subscribeWebsocket() {
    this.authService.getToken().then(token => {
      const config: StompConfig = {
        url: environment.gms_websocket_server,
        headers: {
          Authorization: `Bearer ${token}`
        },
        heartbeat_in: 0,
        heartbeat_out: 20000,
        reconnect_delay: 5000,
        debug: false,
      };
      this.websocket.config = config;
      this.websocket.initAndConnect();

      this.golfClubService.getCurrentGolfClub().pipe(
        debounceTime(300)
      ).subscribe(golfClub => {
        if (golfClub) {
          this.websocket.subscribe(`/queue/events/golf/clubs/${golfClub.id}/orders`, {
            Authorization: `Bearer ${token}`
          }).pipe(
            map(message => JSON.parse(message.body).object)
          ).subscribe(order => {
            this.tables = this.tables.map(table => {
              if (table.id === order.table_map.id) {
                return order.table_map;
              } else {
                return table;
              }
            });
          });
        }
      });
    });
  }

  async presentLoading(message) {
    console.log('presentLoading');
    const loading = await this.loadingCtrl.create({
      spinner: 'circular',
      message,
      translucent: false,
    });
    await loading.present();
  }

  showAlertLogout() {
    this.alertController.create({
      header: 'Không có Golf Club nào!',
      subHeader: 'subHeader',
      message: 'Tài khoản của bạn không thể thực hiện thao tác này!',
      buttons: ['OK']
    }).then(_ => {
      this.authService.logout();
    });

  }

  compareWith = (a, b) => {
    if (!a || !b) {
      return false;
    }
    return a.id === b.id;
  };

  handleSave() {
    this.locationService.setLocation(this.form.get('location').value);
    this.router.navigate(['/home']);
  }

  doRefresh(event) {
    this.loadingTable = true;
    this.tableService.getAll(this.form.get('golfClub').value.id, this.form.get('location').value.id, this.searchTable)
      .pipe(delay(300))
      .subscribe(tables => {
          this.tables = tables;
          this.loadingTable = false;
          event.target.complete();
        }, error => {
          this.loadingTable = false;
          event.target.complete();
        }
      );
  }

  get currentLang() {
    return this.translate.currentLang;
  }

  toggleLang() {
    if (this.currentLang === 'en') {
      this.translate.use('vi');
    } else {
      this.translate.use('en');
    }
  }


  ngOnDestroy() {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
