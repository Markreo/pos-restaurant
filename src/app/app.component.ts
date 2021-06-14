import {Component, OnDestroy, OnInit} from '@angular/core';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {Platform, ToastController} from '@ionic/angular';
import {Network} from '@ionic-native/network/ngx';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  networkChange;
  toast: HTMLIonToastElement;

  constructor(private screenOrientation: ScreenOrientation,
              public platform: Platform,
              private network: Network,
              public toastController: ToastController,
              private translate: TranslateService) {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      });
    }

    this.screenOrientation.onChange().subscribe(
      () => {
        console.log('Orientation Changed');
      }
    );
    translate.setDefaultLang('en');
    translate.use('en');
  }

  async ngOnInit() {
    this.networkChange = this.network.onChange().subscribe(change => {
      console.log('change', change);
      if (this.toast) {
        this.toast.dismiss();
      }
      this.presentToast(change).then(toast => {
        this.toast = toast;
      });
    });
  }

  async presentToast(status: 'connected' | 'disconnected') {
    const config = status === 'connected' ? {
      message: 'Network connected!',
      duration: 2000,
      color: 'primary'
    } : {message: 'Network was disconnected!', color: 'danger'};
    const toast = await this.toastController.create(config);
    toast.present();
    return toast;
  }


  ngOnDestroy() {
    this.networkChange.unsubscribe();
  }
}
