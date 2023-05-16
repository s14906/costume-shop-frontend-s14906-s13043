import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../core/service/http.service";
import {Subscription} from "rxjs";
import {TokenStorageService} from "../../core/service/token-storage.service";
import {ItemCartModel} from "../../shared/models/data.models";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    cartItems: ItemCartModel[] = [];
    totalPrice: number = 0;
    priceTimesItemCount: number[] = [];

    constructor(private httpService: HttpService,
                private tokenStorageService: TokenStorageService) {
        this.allSubscriptions.push(
            this.httpService.getCartItemsByUserId(this.tokenStorageService.getUser().id)
                .subscribe(response => {
                    this.cartItems = response.cartItems
                    this.cartItems.forEach((cartItem) => {
                        this.totalPrice = this.totalPrice + (cartItem.item.price * cartItem.itemAmount);
                        this.priceTimesItemCount.push(cartItem.item.price * cartItem.itemAmount);
                    });
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
