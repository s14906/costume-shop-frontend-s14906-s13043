import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {finalize, Subscription} from "rxjs";
import {AuthService} from "../../core/service/auth.service";
import {MessageService} from "../../core/service/message.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;

  username: string;

  private subscription: Subscription;

  constructor(public authService: AuthService, private headerRefreshService: MessageService) {
    this.subscription = this.headerRefreshService.getUpdate().subscribe
    ((message) => {
      this.ngOnInit();
      this.username = message.text;
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
