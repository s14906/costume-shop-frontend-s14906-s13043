import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {combineLatest, Subscription} from "rxjs";
import {AuthService} from "../../core/service/auth.service";
import {SnackbarService} from "../../core/service/snackbar.service";
import {TokenStorageService} from "../../core/service/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class HeaderComponent implements OnDestroy {
  loggedIn: boolean = false;

  userRoles?: string[];

  private allSubscriptions: Subscription[] = [];

  constructor(public authService: AuthService,
              private snackbarService: SnackbarService,
              private tokenStorageService: TokenStorageService,
              private router: Router
  ) {
    this.allSubscriptions.push(
      combineLatest([this.authService.getIsLoggedIn(), this.tokenStorageService.getUserRoles()])
      .subscribe(userData => {
        this.loggedIn = userData[0];
        this.userRoles = userData[1];
      }));
  }

  logout() {
    this.tokenStorageService.signOut();
    this.authService.announceLogout();
    this.snackbarService.openSnackBar('Logged out!');
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToAccountInformation() {
    this.router.navigate(['/account']);
  }

  navigateToComplaints() {
    this.router.navigate(['complaints']);
  }
}
