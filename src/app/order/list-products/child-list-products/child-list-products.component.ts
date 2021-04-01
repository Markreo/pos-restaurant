import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProductService} from '../../../_services/product.service';
import {LocationService} from '../../../_services/location.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-child-list-products',
  templateUrl: './child-list-products.component.html',
  styleUrls: ['./child-list-products.component.scss'],
})
export class ChildListProductsComponent implements OnInit, OnChanges {
  @Input() thisIndex: number;
  @Input() currentIndex = 0;
  inited = false;
  currentLocation;
  loading = true;

  products;

  constructor(private productService: ProductService, private locationService: LocationService) {
    this.locationService.getCurrentLocation().pipe(take(1)).subscribe(location => {
      this.currentLocation = location;
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.currentIndex === this.thisIndex && !this.inited) {
      this.init();
    }
  }

  init() {
    console.log('init', this.thisIndex);
    this.inited = true;
    this.loading = true;
    this.productService.getAllWithFilter(this.currentLocation.id, {
      start: (this.thisIndex ) * 12,
      max: 12
    }).subscribe(resp => {
      this.loading = false;
      this.products = resp.data;
    });
  }

}
