import { Component, OnInit } from '@angular/core';
import {LocationEntity} from '../_models/location.entity';
import {LocationService} from '../_services/location.service';
import {Router} from '@angular/router';
import {CategoryService} from '../_services/category.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  location: LocationEntity;

  constructor(private locationService: LocationService,
              private router: Router, private categoryService: CategoryService) {
    this.locationService.getCurrentLocation().pipe(
      take(1)
    ).subscribe(location => {
      if (!location) {
        this.router.navigate(['/select-location']);
      } else {
        this.location = location;
        this.loadCategory();
      }
    });
  }

  ngOnInit() {
  }

  loadCategory() {
    this.categoryService.getAll(this.location.id).subscribe(categories => {
      console.log('categories', categories);
    });
  }
}
