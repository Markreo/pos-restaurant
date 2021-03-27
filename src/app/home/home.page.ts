import {Component, OnInit} from '@angular/core';
import {TableService} from '../_services/table.service';
import {GolfClubService} from '../_services/golf-club.service';
import {LocationService} from '../_services/location.service';
import {combineLatest} from 'rxjs';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Table} from '../_models/table';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  tables: Table[] = [];
  loadingTable = true;

  constructor(private table: TableService,
              private golfService: GolfClubService,
              private locationService: LocationService,
              private router: Router) {

  }

  ngOnInit() {
    combineLatest(this.golfService.getCurrentGolfClub(), this.locationService.getCurrentLocation())
      .pipe(take(1))
      .subscribe(([g, l]) => {
        console.log('[g, l]', [g, l]);
        if (l) {
          this.loadTables(g, l);
        } else {
          this.router.navigate(['/setting']);
        }
      });
  }

  loadTables(club, location) {
    this.loadingTable = true;
    this.table.getAll(club.id, location.id).subscribe(tables => {
      this.loadingTable = false;
      this.tables = tables;
    }, error => {
      this.loadingTable = false;
    });
  }
}
