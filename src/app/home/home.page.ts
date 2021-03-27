import {Component} from '@angular/core';
import {LocationService} from '../_services/location.service';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private locationService: LocationService, private router: Router) {
    this.locationService.getLocation().pipe(
      take(1)
    ).subscribe(location => {
      if (!location) {
        this.router.navigate(['/select-location']);
      }
    });
  }

}
