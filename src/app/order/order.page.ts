import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationEntity} from '../_models/location.entity';
import {LocationService} from '../_services/location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../_services/category.service';
import {debounceTime, map, switchMap, take} from 'rxjs/operators';
import {TableService} from '../_services/table.service';
import {combineLatest, of, Subject} from 'rxjs';
import {GolfClubService} from '../_services/golf-club.service';
import {Table} from '../_models/table';
import {GolfClubEntity} from '../_models/golf-club.entity';
import {Menu} from '../_models/menu';
import {MenuService} from '../_services/menu.service';
import {Category} from '../_models/category';
import {ListProductsComponent} from './list-products/list-products.component';
import {isCombinedNodeFlagSet} from 'tslint';
import {WebsocketService} from '../websocket/websocket-service';
import {StompConfig} from '@stomp/ng2-stompjs';
import {environment} from '../../environments/environment';
import {AuthService} from '../_services/auth.service';
import {TranslateService} from '@ngx-translate/core';

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
  filter: { menu?, category?, search? } = {
    category: null,
    search: ''
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
              private websocket: WebsocketService,
              private translate: TranslateService,
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
    console.log('get categofri form menu');
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
      if (this.menus) {
        this.selectMenu(this.menus[0]);
      }
    }, error => {});
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
    this.filter.menu = null;
    this.filter.category = menu.id;
    this.listProductRef.updateFilter(this.filter);
  }

  selectMenu(menu: Menu) {
    this.currentMenu = menu;
    this.updateSubCategory();
    this.filter.category = null;
    this.filter.menu = menu.id;
    this.listProductRef.updateFilter(this.filter);
  }

  /*level 2 */
  selectSubCategory(category: Category) {
    this.currentSubCate = category;
    if (category) {
      if (this.location.enable_menu) {
        this.filter.category = category.id;
        if (this.currentMenu) {
          this.filter.menu = this.currentMenu.id;
        } else {
          this.filter.menu = null; // this should not work
        }
      } else {
        this.filter.menu = null;
        this.filter.category = category.id;
      }
    } else {
      if (this.currentMenu) {
        if (this.location.enable_menu) {
          this.filter.menu = this.currentMenu.id;
          this.filter.category = null;
        } else {
          this.filter.menu = null;
          this.filter.category = this.currentMenu.id;
        }
      } else {
        this.filter.category = null;
        this.filter.menu = null;
      }
    }
    this.listProductRef.updateFilter(this.filter);
  }

  updateSearch() {
    this.listProductRef.updateFilter(this.filter);
  }

  updatePagination(slides) {
    this.slides = slides;
  }

  get currentLang() {
    return this.translate.currentLang;
  }

  toggleLang() {
    if (this.currentLang === 'en') {
      this.translate.use('vi');
    } else {
      this.translate.use('en');
    }
  }
}
