import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemModel} from "../../../shared/models/data.models";
import {HttpService} from "../../../core/service/http.service";
import {Subscription} from "rxjs";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {AuthService} from "../../../core/service/auth.service";
import {TokenStorageService} from "../../../core/service/token-storage.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  items: ItemModel[] = [];
  allSubscriptions: Subscription[] = [];

  constructor(private httpService: HttpService,
              private snackbarService: SnackbarService,
              private authService: AuthService,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
   this.allSubscriptions.push(this.httpService.getAllItems()
      .subscribe({
        next: items =>
            items.forEach(item => this.items.push(item)),
        error: err => {
          this.authService.announceLogout();
          this.tokenStorageService.signOut();
          if (err.status === 403) {
            this.snackbarService.openSnackBar("There was a problem with your JWT token or the token has expired. Please log in again.");
          } else {
            this.snackbarService.openSnackBar("An authentication problem has occurred. Please log in again.");
          }
          window.location.reload();
        }
  }));
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
