import {Component, OnInit} from '@angular/core';
import {LocationService} from '../_services/location.service';
import {GolfClubService} from '../_services/golf-club.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.page.html',
  styleUrls: ['./select-location.page.scss'],
})
export class SelectLocationPage implements OnInit {


  // todo: return back url
  // todo: init value location
  constructor(private locationService: LocationService,
              private golfClubService: GolfClubService,
              private loadingCtrl: LoadingController,
              private alertController: AlertController,
              private router: Router,
              private authService: AuthService) {

  }

  ngOnInit() {

  }


}
