import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';
import {TokenInterceptor} from './_interceptors/token.interceptor';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import { Network } from '@ionic-native/network/ngx';

const interceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }
];

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [interceptors, {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, ScreenOrientation, Network],
  bootstrap: [AppComponent],
})
export class AppModule {
}
