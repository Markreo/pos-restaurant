import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationEntity} from '../_models/location.entity';
import {LocationService} from '../_services/location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../_services/category.service';
import {debounceTime, switchMap, take} from 'rxjs/operators';
import {TableService} from '../_services/table.service';
import {combineLatest, of, Subject} from 'rxjs';
import {GolfClubService} from '../_services/golf-club.service';
import {Table} from '../_models/table';
import {GolfClubEntity} from '../_models/golf-club.entity';
import {Menu} from '../_models/menu';
import {MenuService} from '../_services/menu.service';
import {Category} from '../_models/category';
import {ListProductsComponent} from './list-products/list-products.component';

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

  menus: Menu[] = [];

  table: Table;
  filter = {
    category: null
  };


  slides = [];
  currentIndex = 0;


  currentMenu: Category | Menu;
  currentSubCate: Category;
  subMenuSubject = new Subject<{ type: 'category' | 'menu', object: any }>();

  @ViewChild(ListProductsComponent, {static: true}) listProductRef: ListProductsComponent;

  constructor(private locationService: LocationService,
              private golfClubService: GolfClubService,
              private tableService: TableService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menuService: MenuService,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    combineLatest(this.activatedRoute.params, this.locationService.getCurrentLocation(), this.golfClubService.getCurrentGolfClub())
      .pipe(
        take(1)
      )
      .subscribe(([params, location, golf]) => {
        location.enable_menu = false; // hardcode
        if (location && golf) {
          this.golfClub = golf;
          this.location = location;
          if (params.id) {
            this.getTable(golf.id, params.id);
          }
          console.log('enable_menu:', location.enable_menu);
          if (location.enable_menu) {
            this.loadMenu(location);
          } else {
            this.loadCategory(location);
          }
        } else {
          this.router.navigate(['/home']);
        }
      });
    this.subscribeSubMenu();
  }

  subscribeSubMenu() {
    this.subMenuSubject.pipe(
      debounceTime(300),
      switchMap(filter => {
        if (filter.type === 'category') {
          if (filter.object) {
            return of(this.rawCategories.filter(cate => cate.parent_id === filter.object.id));
          } else {
            return of(this.rawCategories.filter(cate => !!cate.parent_id));
          }
        } else {
          console.log('here', filter);
          if (filter.object) {
            return this.getCategoryFormMenu(filter.object.id);
          } else {
            return of([]);
          }
        }
      })
    ).subscribe(categories => {
      this.subCategories = categories;
    });
  }

  updateSubCategory() {
    this.subMenuSubject.next({type: this.location.enable_menu ? 'menu' : 'category', object: this.currentMenu});
  }

  getCategoryFormMenu(menuId) {
    return this.menuService.getListCategoriesByMenu(menuId);
  }

  getTable(golfId, id) {
    this.tableService.get(golfId, id).subscribe(table => {
      this.table = table;
    });
  }

  loadMenu(location) {
    this.menuService.getMenuByLocation(location.id).subscribe(resp => {
      this.menus = resp.data;
      console.log('menu', this.menus);
    });
  }

  loadCategory(location: LocationEntity) {
    this.categoryService.getAll(location.id).subscribe(categories => {
      this.rawCategories = categories;
      this.parentCategories = categories.filter(cate => !cate.parent_id);
      this.updateSubCategory();
      if (!this.currentMenu && this.parentCategories.length) {
        this.currentMenu = this.parentCategories[0];
      }
    });
  }

  /*level 1 */

  selectParentCategory(menu) {
    this.currentMenu = menu;
    this.currentSubCate = null;
    this.updateSubCategory();
    this.listProductRef.updateFilter({category: menu.id});
  }

  selectMenu(menu: Menu) {
    this.currentMenu = menu;
    this.updateSubCategory();
  }

  /*level 2 */
  selectSubCategory(category: Category) {
    this.currentSubCate = category;
    if (category) {
      if (this.location.enable_menu) {
        this.listProductRef.updateFilter({category: category.id});
      } else {
        this.listProductRef.updateFilter({category: category.id});
      }
    } else {
      if (this.currentMenu) {
        if (this.location.enable_menu) {
          this.listProductRef.updateFilter({menu: this.currentMenu.id});
        } else {
          this.listProductRef.updateFilter({category: this.currentMenu.id});
        }
      } else {
        this.listProductRef.updateFilter({});
      }
    }
  }

  updatePagination(slides) {
    this.slides = slides;
  }
}
