import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import { Subscription} from "rxjs";
import {AuthService} from "../../core/service/auth.service";
import {SnackbarService} from "../../core/service/snackbar.service";
import {TokenStorageService} from "../../core/service/token-storage.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class HeaderComponent implements OnDestroy {
  loggedIn: boolean = false;

  username: string;

  private subscription: Subscription;

  constructor(public authService: AuthService, private snackbarService: SnackbarService,
              private tokenStorageService: TokenStorageService) {
    this.subscription = this.authService.getIsLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  logout() {
    this.tokenStorageService.signOut();
    this.authService.announceLogout();
    this.snackbarService.openSnackBar('Logged out!');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
