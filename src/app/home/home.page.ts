import {Component} from '@angular/core';
import {LocationService} from '../_services/location.service';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {LocationEntity} from '../_models/location.entity';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  location: LocationEntity;

  constructor(private locationService: LocationService, private router: Router) {
    this.locationService.getLocation().pipe(
      take(1)
    ).subscribe(location => {
      console.log('location', location);
      if (!location) {
        this.router.navigate(['/select-location']);
      } else {
        this.location = location;
      }
    });
  }

}
