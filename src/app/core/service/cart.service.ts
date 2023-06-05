import {Injectable} from "@angular/core";
import {AddressDTO, CartConfirmationDTO, CartItemDTO} from "../../shared/models/dto.models";
import {HttpService} from "./http/http.service";
import {StorageService} from "./storage.service";
import {Router} from "@angular/router";
import {SnackbarService} from "./snackbar.service";
import {HttpErrorService} from "./http/http-error.service";
import {Subscription} from "rxjs";
import {CartResponse, GetAddressesResponse} from "../../shared/models/rest.models";
import {CartConfirmationDataModel, CartDataModel} from "../../shared/models/data.models";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    currentUser;

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private snackbarService: SnackbarService,
                private httpErrorService: HttpErrorService,
                private router: Router) {

        this.currentUser = this.storageService.getUser();
    }

    deleteItemFromCart(cartItem: CartItemDTO, allSubscriptions: Subscription[]): void {
        allSubscriptions.push(
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

    prepareCartData(next: CartResponse): CartDataModel {
        const cartItems: CartItemDTO[] = next.cartItems
        let totalPrice: number = 0;
        const priceTimesItemCount: number[] = [];
        cartItems.forEach((cartItem: CartItemDTO) => {
            totalPrice = totalPrice + (cartItem.price * cartItem.items.length);
            priceTimesItemCount.push(cartItem.price * cartItem.items.length);
        });
        return {
            cartItems: cartItems,
            totalPrice: totalPrice,
            priceTimesItemCount: priceTimesItemCount
        }
    }

    prepareCartConfirmationData(cartResponse: CartResponse): CartConfirmationDataModel {
        const cartItems: CartItemDTO[] = cartResponse.cartItems;
        let totalPrice: number = 0;
        cartItems.forEach((cartItem: CartItemDTO) => {
            totalPrice = totalPrice + (cartItem.price * cartItem.items.length);
        });
        return {
            cartItems: cartItems,
            totalPrice: totalPrice
        }
    }

    commencePayment(selectedAddress: AddressDTO, totalPrice: number,
                    cartItems: CartItemDTO[], allSubscriptions: Subscription[]) {
        if (selectedAddress) {
            const cartConfirmationDTO: CartConfirmationDTO = {
                userId: this.currentUser.id,
                paidAmount: totalPrice,
                address: selectedAddress,
                cartItems: cartItems
            };

            allSubscriptions.push(
                this.httpService.postCreateNewOrderPaymentTransaction(cartConfirmationDTO)
                    .subscribe({
                        next: next => {
                            this.snackbarService.openSnackBar(next.message);
                            this.router.navigate(['payment-success'], {
                                queryParams: {
                                    paymentTransactionId: next.paymentTransactionId
                                }
                            });

                        },
                        error: err => {
                            this.httpErrorService.handleError(err);
                        }
                    })
            );
        }
    }

    prepareAllAddressesForBuyer(addressResponse: GetAddressesResponse): AddressDTO[] {
        return addressResponse.addresses
            .sort((address1: AddressDTO, address2: AddressDTO) =>
                address1.addressId > address2.addressId ? 1 : -1);
    }
}
