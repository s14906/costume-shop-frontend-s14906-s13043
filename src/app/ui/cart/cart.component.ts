import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../core/service/http.service";
import {Subscription} from "rxjs";
import {StorageService} from "../../core/service/storage.service";
import {HttpErrorService} from "../../core/service/http-error.service";
import {CartItemDTO} from "../../shared/models/dto.models";
import {Router} from "@angular/router";
import {SnackbarService} from "../../core/service/snackbar.service";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    cartItems: CartItemDTO[] = [];
    totalPrice: number = 0;
    priceTimesItemCount: number[] = [];
    currentUser;

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private httpErrorService: HttpErrorService,
                private snackbarService: SnackbarService,
                private router: Router) {
        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.httpService.getCartByUserId(this.storageService.getUser().id)
                .subscribe({
                    next: next => {

                        this.cartItems = next.cartItems
                        this.cartItems.forEach((cartItem) => {
                            this.totalPrice = this.totalPrice + (cartItem.price * cartItem.items.length);
                            this.priceTimesItemCount.push(cartItem.price * cartItem.items.length);
                        });
                    }, error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    navigateToCartConfirmation() {
        this.router.navigate(['cart/confirmation']);
    }

    deleteItemFromCart(cartItem: CartItemDTO) {
        this.allSubscriptions.push(
            this.httpService.deleteCartItemByUserIdAndCartItemId(this.currentUser.id, cartItem.cartItemId)
                .subscribe({
                    next: next => {
                        this.snackbarService.openSnackBar(next.message);
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                            this.router.navigate(['cart']);
                        });
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        );
    }
}
