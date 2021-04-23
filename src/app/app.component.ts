import {Component} from '@angular/core';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private screenOrientation: ScreenOrientation, public platform: Platform) {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        console.log('lockkkkkk')
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      });
    }

    this.screenOrientation.onChange().subscribe(
      () => {
        console.log('Orientation Changed');
      }
    );
  }
}
