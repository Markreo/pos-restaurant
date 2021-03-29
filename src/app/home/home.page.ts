import {Component, OnInit} from '@angular/core';
import {TableService} from '../_services/table.service';
import {GolfClubService} from '../_services/golf-club.service';
import {LocationService} from '../_services/location.service';
import {Router} from '@angular/router';
import {Table} from '../_models/table';
import {LocationEntity} from '../_models/location.entity';
import {GolfClubEntity} from '../_models/golf-club.entity';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from '../_services/auth.service';
import {Observable, Subject} from 'rxjs';
import {delay, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  locations: LocationEntity[] = [];
  golfClubs: GolfClubEntity[] = [];
  tables: Table[] = [];

  form: FormGroup = new FormGroup({
    golfClub: new FormControl(null, Validators.required),
    location: new FormControl(null, Validators.required),
  });
  loadingTable = true;
  getLocationSubscription: Observable<Location[]>;

  loadLocationSubject = new Subject<GolfClubEntity>();
  tableSubject = new Subject<Table[]>();
  initLocation = false;

  constructor(private tableService: TableService,
              private golfClubService: GolfClubService,
              private locationService: LocationService,
              private loadingCtrl: LoadingController,
              private alertController: AlertController,
              private authService: AuthService,
              private router: Router) {
    this.form.get('golfClub').valueChanges.subscribe(golfClub => {
      if (golfClub) {
        this.golfClubService.setCurrentGolfClub(golfClub);
        this.loadLocationSubject.next(golfClub);
      }
    });
    this.form.get('location').valueChanges.subscribe(location => {
      if (location) {
        this.locationService.setLocation(location);
        this.tableSubject.next();
      }

    });
  }

  ngOnInit() {
    this.presentLoading('Đang tải thông tin...');
    this.subscribeLoadLocation();
    this.subscribeTable();
    this.golfClubService.getAllByUser().subscribe(golfClubs => {
      if (golfClubs && Array.isArray(golfClubs)) {
        this.golfClubs = golfClubs;
      }
      this.golfClubService.getCurrentGolfClub().pipe(
        delay(100)
      ).subscribe(currentGolfClub => {
        if (currentGolfClub) {
          this.form.get('golfClub').setValue(currentGolfClub);
        } else {
          if (golfClubs.length === 1) {
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
      this.locations = locations;

      if (!this.initLocation) {
        console.log('dissmiss');
        this.loadingCtrl.dismiss();
        this.initLocation = true;
        this.locationService.getCurrentLocation().subscribe(location => {
          if (location) {
            this.form.get('location').setValue(location);
          }
        });
      }
    });
  }

  subscribeTable() {
    this.tableSubject.pipe(
      switchMap(() => {
        this.loadingTable = true;
        return this.tableService.getAll(this.form.get('golfClub').value.id, this.form.get('location').value.id);
      })
    ).subscribe(tables => {
      this.loadingTable = false;
      this.tables = tables;
    }, error => {
      this.loadingTable = false;
    });
  }

  async presentLoading(message) {
    const loading = await this.loadingCtrl.create({
      spinner: 'circular',
      message,
      translucent: false,
    });
    await loading.present();
  }

  showAlertLogout() {
    this.alertController.create({
      header: 'Không có Golf CLub nào!',
      subHeader: 'subHeader',
      message: 'Tài khoản của bạn không thể thực hiện thao tác này!',
      buttons: ['OK']
    }).then(_ => {
      console.log('then');
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
}
