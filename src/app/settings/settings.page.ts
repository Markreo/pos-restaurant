import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  form = new FormGroup({
    itemPerSlide: new FormControl(0, Validators.required),
    itemWidth: new FormControl(0, Validators.required),
    itemHeight: new FormControl(0, Validators.required),
  });
  loading = false;

  constructor(private storage: Storage, private router: Router, private toast: ToastController) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loading = false;
    this.storage.get('settings').then(setting => {
      if (!setting) {
        setting = {};
      }
      this.form.patchValue({
        itemPerSlide: setting.itemPerSlide || 12,
        itemWidth: setting.itemWidth || 250,
        itemHeight: setting.itemHeight || 250,
      });
    });
  }

  handleSave() {
    if (this.form.valid) {
      this.loading = true;
      this.storage.set('settings', this.form.value);
      this.toast.create({
        message: 'Your settings have been saved.',
        duration: 1000
      }).then(toast => {
        toast.present();
        toast.onDidDismiss().then(({role}) => {
          console.log('onDidDismiss resolved with role', role);
          this.router.navigate(['/home']);
          this.loading = false;

        });
      });
    }
  }

}
