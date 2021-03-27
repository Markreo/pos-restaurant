import {Component, OnInit} from '@angular/core';
import {LocationService} from '../_services/location.service';
import {GolfClubEntity} from '../_models/golf-club.entity';
import {GolfClubService} from '../_services/golf-club.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from '../_services/auth.service';
import {LocationEntity} from '../_models/location.entity';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.page.html',
  styleUrls: ['./select-location.page.scss'],
})
export class SelectLocationPage implements OnInit {
  locations: LocationEntity[] = [];
  golfClubs: GolfClubEntity[] = [];
  init = false;
  form: FormGroup = new FormGroup({
    golfClub: new FormControl(null, Validators.required),
    location: new FormControl(null, Validators.required),
  });

  // todo: return back url
  // todo: init value location
  constructor(private locationService: LocationService,
              private golfClubService: GolfClubService,
              private loadingCtrl: LoadingController,
              private alertController: AlertController,
              private router: Router,
              private authService: AuthService) {
    this.form.get('golfClub').valueChanges.subscribe(golfClub => {
      if (golfClub) {
        this.loadLocation(golfClub);
      }
    });
  }

  ngOnInit() {
    this.golfClubService.getCurrentGolfClub().subscribe(club => {
      if (club) {
        this.golfClubs = [club];
        this.form.get('golfClub').setValue(club);
      } else {
        this.initGolfClub();
      }
    });
  }

  loadLocation(golfClub: GolfClubEntity) {
    this.presentLoading('Đang lấy danh sách Locations...');
    this.locationService.getAllByClub(golfClub.id).subscribe(locations => {
      this.locations = locations;
      this.loadingCtrl.dismiss();
      console.log('dissmiss');
    }, error => {
      this.loadingCtrl.dismiss();
      console.log('dissmiss');
    });
  }

  initGolfClub() {
    this.presentLoading('Đang lấy danh sách Golf Clubs...');
    this.golfClubService.getAllByUser().subscribe(golfClubs => {
      this.loadingCtrl.dismiss();
      if (golfClubs && Array.isArray(golfClubs)) {
        this.golfClubs = golfClubs;
        if (golfClubs.length === 1) {
          this.form.get('golfClub').setValue(golfClubs[0]);
          this.golfClubService.setCurrentGolfClub(golfClubs[0]);
        } else {
          if (golfClubs.length === 0) {
            this.showAlertLogout();
          } else {
            console.log('this.golfClubs', this.golfClubs);
          }
        }
      } else {
        this.showAlertLogout();
      }
    }, error => {
      this.loadingCtrl.dismiss();
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
