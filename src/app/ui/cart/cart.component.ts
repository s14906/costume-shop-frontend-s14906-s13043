import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../core/service/http.service";
import {Subscription} from "rxjs";
import {StorageService} from "../../core/service/storage.service";
import {HttpErrorService} from "../../core/service/http-error.service";
import {CartItemDTO} from "../../shared/models/dto.models";

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

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private httpErrorService: HttpErrorService) {
        this.allSubscriptions.push(
            this.httpService.getCartItemsByUserId(this.storageService.getUser().id)
                .subscribe({
                    next: next => {
                        this.cartItems = next.cartItems
                        this.cartItems.forEach((cartItem) => {
                            this.totalPrice = this.totalPrice + (cartItem.price * cartItem.itemsAmount);
                            this.priceTimesItemCount.push(cartItem.price * cartItem.itemsAmount);
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
}
