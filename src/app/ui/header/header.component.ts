import {Component, OnDestroy} from '@angular/core';
import {combineLatest, Subscription} from "rxjs";
import {AuthService} from "../../core/service/auth.service";
import {SnackbarService} from "../../core/service/snackbar.service";
import {StorageService} from "../../core/service/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements OnDestroy {
  loggedIn: boolean = false;

  userRoles?: string[];

  private allSubscriptions: Subscription[] = [];
    searchText: string;

  constructor(public authService: AuthService,
              private snackbarService: SnackbarService,
              private storageService: StorageService,
              private router: Router
  ) {
    this.allSubscriptions.push(
      combineLatest([this.authService.getIsLoggedIn(), this.storageService.getUserRoles()])
      .subscribe(userData => {
        this.loggedIn = userData[0];
        this.userRoles = userData[1];
      }));
  }

  logout() {
    this.storageService.signOut();
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

  navigateToOrderHistory() {
    this.router.navigate(['orders']);
  }

  navigateToAllOrders() {
    this.router.navigate(['orders/all']);
  }

  checkEnterKeyPressed($event) {
    if ($event.key === 'Enter') {
      this.navigateToSearch();
    }
  }

  navigateToSearch() {
    if (this.searchText !== '') {
      this.router.navigate(['/'], {
        queryParams: {
          searchText: this.searchText
        }
      });
    } else {
      this.router.navigate(['/']);
    }

  }

  navigateToHome() {
    this.searchText = '';
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    } else {
      window.location.reload();
    }
  }
}
