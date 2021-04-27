import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationEntity} from '../_models/location.entity';
import {LocationService} from '../_services/location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../_services/category.service';
import {take} from 'rxjs/operators';
import {TableService} from '../_services/table.service';
import {combineLatest} from 'rxjs';
import {GolfClubService} from '../_services/golf-club.service';
import {isCombinedNodeFlagSet} from 'tslint';
import {Table} from '../_models/table';
import {GolfClubEntity} from '../_models/golf-club.entity';
import {PaymentComponent} from './payment/payment.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  golfClub: GolfClubEntity;
  location: LocationEntity;
  rawCategories = [];
  parentCategories = [];
  subCategories = [];

  table: Table;
  filter = {
    category: null
  };


  slides = [];
  currentIndex = 0;


  currentMenu;

  constructor(private locationService: LocationService,
              private golfClubService: GolfClubService,
              private tableService: TableService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    combineLatest(this.activatedRoute.params, this.locationService.getCurrentLocation(), this.golfClubService.getCurrentGolfClub())
      .pipe(
        take(1)
      )
      .subscribe(([params, location, golf]) => {
        if (location && golf) {
          this.golfClub = golf;
          this.location = location;
          if (params.id) {
            this.getTable(golf.id, params.id);
          }
          this.loadCategory(location);
        } else {
          this.router.navigate(['/home']);
        }
      });
  }

  getTable(golfId, id) {
    this.tableService.get(golfId, id).subscribe(table => {
      this.table = table;
    });
  }

  loadCategory(location: LocationEntity) {
    this.categoryService.getAll(location.id).subscribe(categories => {
      this.rawCategories = categories;
      this.parentCategories = categories.filter(cate => !cate.parent_id);
      this.subCategories = categories.filter(cate => !!cate.parent_id);
      if (!this.currentMenu && this.parentCategories.length) {
        this.currentMenu = this.parentCategories[0];
      }
    });
  }

  selectMenu(menu) {
    this.currentMenu = menu
  }

  updatePagination(slides) {
    this.slides = slides;
  }
}
