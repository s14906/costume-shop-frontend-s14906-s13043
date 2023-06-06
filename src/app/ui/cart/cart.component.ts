import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {StorageService} from "../../core/service/storage.service";
import {CartItemDTO} from "../../shared/models/dto.models";
import {Router} from "@angular/router";
import {CartService} from "../../core/service/cart.service";
import {CartDataModel, UserModel} from "../../shared/models/data.models";
import {HttpService} from "../../core/service/http/http.service";
import {HttpErrorService} from "../../core/service/http/http-error.service";
import {CartResponse} from "../../shared/models/rest.models";

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
    currentUser: UserModel;
    loading: boolean = true;

    constructor(private storageService: StorageService,
                private cartService: CartService,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private router: Router) {

        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.httpService.getCartByUserId(this.storageService.getUser().id)
                .subscribe({
                    next: (next: CartResponse): void => {
                        const cartData: CartDataModel = this.cartService.prepareCartData(next);
                        this.cartItems = cartData.cartItems;
                        this.priceTimesItemCount = cartData.priceTimesItemCount;
                        this.totalPrice = cartData.totalPrice;
                        this.loading = false;

                    }, error: err => {
                        this.httpErrorService.handleError(err);
                        this.loading = false;
                    }
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    navigateToCartConfirmation(): void {
        this.router.navigate(['cart/confirmation']);
    }

    deleteItemFromCart(cartItem: CartItemDTO): void {
        this.cartService.deleteItemFromCart(cartItem, this.allSubscriptions);
    }
}
