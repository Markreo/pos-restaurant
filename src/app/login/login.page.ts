import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  submitted = false;
  credentials = {
    username: '',
    password: ''
  };

  constructor(private loadingCtrl: LoadingController,
              private authService: AuthService,
              private router: Router,
              private alertCtrl: AlertController) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.authService.isLogged().then(loginData => {
      if (loginData) {
        this.onLoginSuccess();
      }
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'circular',
      message: 'Đang đăng nhập...',
      translucent: false,
    });
    await loading.present();
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      message: 'Tên đăng nhập hoặc mật khẩu không đúng!',
      buttons: ['OK']
    });

    await alert.present();
  }

  onLogin(form) {
    this.submitted = true;
    if (form.valid) {
      this.presentLoading().then(() => {
        this.authService.login(this.credentials).subscribe(resp => {
          this.loadingCtrl.dismiss();
          this.onLoginSuccess();
        }, error => {
          this.loadingCtrl.dismiss();
          this.presentAlert();
        });
      });
    }
  }

  onLoginSuccess() {
    this.router.navigate(['/']);
  }

}
