import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {finalize, Subscription} from "rxjs";
import {AuthService} from "../../core/service/auth.service";
import {HeaderRefreshService} from "../../core/service/header-refresh.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;

  private subscription: Subscription;

  constructor(public authService: AuthService, private headerRefreshService: HeaderRefreshService) {
    this.subscription = this.headerRefreshService.getUpdate().subscribe
    (() => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
