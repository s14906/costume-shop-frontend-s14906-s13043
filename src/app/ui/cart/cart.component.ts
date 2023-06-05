import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {StorageService} from "../../core/service/storage.service";
import {CartItemDTO} from "../../shared/models/dto.models";
import {Router} from "@angular/router";
import {CartService} from "../../core/service/cart.service";
import {CartDataModel} from "../../shared/models/data.models";
import {HttpService} from "../../core/service/http/http.service";
import {HttpErrorService} from "../../core/service/http/http-error.service";

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

    constructor(private storageService: StorageService,
                private cartService: CartService,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private router: Router) {

        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.httpService.getCartByUserId(this.storageService.getUser().id)
                .subscribe({
                    next: next => {
                        const cartData: CartDataModel = this.cartService.prepareCartData(next);
                        this.cartItems = cartData.cartItems;
                        this.priceTimesItemCount = cartData.priceTimesItemCount;
                        this.totalPrice = cartData.totalPrice;

                    }, error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    navigateToCartConfirmation(): void {
        this.router.navigate(['cart/confirmation']);
    }

    deleteItemFromCart(cartItem: CartItemDTO): void {
        this.cartService.deleteItemFromCart(cartItem, this.allSubscriptions);
    }
}
