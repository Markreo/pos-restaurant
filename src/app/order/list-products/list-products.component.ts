import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProductService} from '../../_services/product.service';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {LocationEntity} from '../../_models/location.entity';
import {Product} from '../../_models/product';
import {IonSlides} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {
  @Input() location: LocationEntity;
  @Output() slidesLength = new EventEmitter<number[]>();
  @Output() slidesIndex = new EventEmitter<number>();
  filterObject = {
    max: 12,
    type: 'STORE'
  };
  productSubject = new Subject();
  total = 0;
  productsAtPage1: Product[] = [];

  loading = true;
  slides = [];
  currentIndex = 0;
  itemSetting = {
    itemWidth: 250,
    itemHeight: 250
  };


  @ViewChild(IonSlides, {static: true}) slidesRef: IonSlides;

  constructor(private productService: ProductService, private storage: Storage) {
  }

  ngOnInit() {
    this.ionViewDidEnter();
    this.subscribeProducts();
    this.updateData();
  }

  ionViewDidEnter() {
    this.storage.get('settings').then(settings => {
      if (!settings) {
        settings = {
          itemPerSlide: 12,
          itemWidth: 250,
          itemHeight: 250,
        };
      }
      const {itemPerSlide, ...itemSetting} = settings;
      this.filterObject.max = itemPerSlide;
      this.itemSetting = itemSetting;
    });
  }

  subscribeProducts() {
    this.productSubject.pipe(
      debounceTime(300),
      switchMap(filter => {
        this.loading = true;
        console.log('filter', filter);
        return this.productService.getAllWithFilter(this.location.id, filter);
      })
    ).subscribe(({total, data}) => {
      this.loading = false;
      this.total = total;
      this.productsAtPage1 = data;

      this.buildSlides();
    }, error => {
      this.loading = false;
    });
  }


  buildSlides() {
    if (this.total) {
      const countPages = Math.ceil(this.total / this.filterObject.max);
      this.slides = Array(countPages - 1).fill(0).map((x, i) => i + 2);
      this.emitSlide();
    }
  }

  updateFilter(filter) {
    this.filterObject = {...this.filterObject, ...filter};
    this.updateData();
  }

  updateData() {
    this.loading = true;
    this.productSubject.next(this.filterObject); // todo: reset page
  }

  onIonSlideDidChange(e) {
    this.slidesRef.getActiveIndex().then(index => {
      this.currentIndex = index;
      this.emitCurrentIndex();
    });
  }

  emitSlide() {
    const a = Array(this.slides.length).fill(0).map((x, i) => i === this.currentIndex ? 1 : 0);
    this.slidesLength.emit(a);
  }

  emitCurrentIndex() {
    this.slidesIndex.emit(this.currentIndex);
  }

  fakeLength() {
    return Array(this.filterObject.max).fill(0).map((x, i) => i);
  }
}
