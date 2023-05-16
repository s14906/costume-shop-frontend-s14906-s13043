import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ItemColorModel, ItemModel, ItemSizeModel} from "../../../shared/models/data.models";
import {HttpService} from "../../../core/service/http.service";
import {combineLatestWith, Subscription} from "rxjs";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {AuthService} from "../../../core/service/auth.service";
import {TokenStorageService} from "../../../core/service/token-storage.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  item?: ItemModel;
  itemSizes: ItemSizeModel[] = [];
  itemColors: ItemColorModel[] = [];

  selectedItemSize: string = '';
  selectedItemColor: string = '';
  private allSubscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private httpService: HttpService,
              private snackbarService: SnackbarService,
              private authService: AuthService,
              private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.allSubscriptions.push(
      this.route.queryParams.pipe(
        combineLatestWith(this.httpService.getAllItems()))
        .subscribe(({
            next: next => {
              const params = next[0];
              const items = next[1];
              this.item = items.find((item: ItemModel) => item.id.toString() === params['id'])
            },
            error: err => {
              this.authService.announceLogout();
              this.tokenStorageService.signOut();
              if (err.status === 403) {
                this.snackbarService.openSnackBar("There was a problem with your JWT token or the token has expired. Please log in again.");
              } else {
                this.snackbarService.openSnackBar("An authentication problem has occurred. Please log in again.");
              }
              this.router.navigate(['/']);
            }
          })));
    this.allSubscriptions.push(
      this.httpService.getAllItemSizes()
        .subscribe(itemSizes => {
          itemSizes.forEach(itemSize => this.itemSizes.push(itemSize));
          this.selectedItemSize = itemSizes[0].size;
        })
    );
    this.allSubscriptions.push(
      this.httpService.getAllItemColors()
        .subscribe(itemColors => {
          itemColors.forEach(itemColor => this.itemColors.push(itemColor));
          this.selectedItemColor = itemColors[0].color;
        })
    );
  }

  clearInput(amountInput: HTMLInputElement) {
    amountInput.setRangeText('');
  }

  getImage() {
    if (this.item?.itemImages) {
      return this.item.itemImages[0].imageBase64;
    }
    return '';
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  addToCart() {
    this.httpService.postAddToCart({
      userId: this.tokenStorageService.getUser().id,
      itemId: this.item?.id,
      itemSizeId: this.itemSizes.find(itemSize => itemSize.size === this.selectedItemSize)?.id
    }).subscribe({
      next: next => {
        this.snackbarService.openSnackBar(next.message);
    },
      error: err => {
        this.snackbarService.openSnackBar(err.error.message);
      }
    })




  }
}
