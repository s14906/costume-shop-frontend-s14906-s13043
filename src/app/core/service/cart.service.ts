import {Injectable} from "@angular/core";
import {AddressDTO, CartConfirmationDTO, CartItemDTO} from "../../shared/models/dto.models";
import {HttpService} from "./http/http.service";
import {StorageService} from "./storage.service";
import {Router} from "@angular/router";
import {SnackbarService} from "./snackbar.service";
import {HttpErrorService} from "./http/http-error.service";
import {concatMap, Subscription} from "rxjs";
import {
    CartResponse,
    GetAddressesResponse,
    PaymentTransactionResponse,
    SimpleResponse
} from "../../shared/models/rest.models";
import {CartConfirmationDataModel, CartDataModel, UserModel} from "../../shared/models/data.models";
import {CartConfirmationComponent} from "../../ui/cart/cart-confirmation/cart-confirmation.component";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    currentUser: UserModel;

    // loadingSubject: Subject<boolean> = new ReplaySubject(1);

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
                    next: (next: CartResponse): void => {
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
        cartItems.forEach((cartItem: CartItemDTO): void => {
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
        cartItems.forEach((cartItem: CartItemDTO): void => {
            totalPrice = totalPrice + (cartItem.price * cartItem.items.length);
        });
        return {
            cartItems: cartItems,
            totalPrice: totalPrice
        }
    }

    commencePayment(component: CartConfirmationComponent, selectedAddress: AddressDTO,
                    totalPrice: number, cartItems: CartItemDTO[], allSubscriptions: Subscription[]): void {
        let itemAmountToBePurchasedLowerOrEqualNumberAvailableForPurchase: boolean
            = this.isItemAmountToBePurchasedLowerOrEqualNumberAvailableForPurchase(cartItems);

        if (!itemAmountToBePurchasedLowerOrEqualNumberAvailableForPurchase) {
            component.loading = false;
            return;
        }

        if (selectedAddress) {
            const cartConfirmationDTO: CartConfirmationDTO = {
                userId: this.currentUser.id,
                paidAmount: totalPrice,
                address: selectedAddress,
                cartItems: cartItems
            };

            allSubscriptions.push(
                this.httpService.postCreateNewOrderPaymentTransaction(cartConfirmationDTO)
                    .pipe(concatMap((response: PaymentTransactionResponse) => {
                            this.snackbarService.openSnackBar(response.message);
                            this.router.navigate(['payment-success'], {
                                queryParams: {
                                    paymentTransactionId: response.paymentTransactionId
                                }
                            });
                            return this.httpService.postSendPaymentTransactionSuccessEmail(cartConfirmationDTO);
                        }
                    )).subscribe({
                        next: (next: SimpleResponse): void => {
                            this.snackbarService.openSnackBar(next.message);
                            component.loading = false;
                        },
                        error: err => {
                            this.httpErrorService.handleError(err.message);
                            component.loading = false;
                        }
                    }
                )
            );
        }
    }

    private isItemAmountToBePurchasedLowerOrEqualNumberAvailableForPurchase(cartItems: CartItemDTO[]) {
        let itemAmountToBePurchasedLowerOrEqualNumberAvailableForPurchase: boolean = true;
        cartItems.forEach((cartItem: CartItemDTO): void => {
            const amountOfItemsToBePurchased: number = cartItem.items.length;
            const itemsAvailableForPurchase: number = cartItem.items[0].quantity;
            if (amountOfItemsToBePurchased >= itemsAvailableForPurchase) {
                itemAmountToBePurchasedLowerOrEqualNumberAvailableForPurchase = false;
                this.snackbarService.openSnackBar('Cannot proceed.\nYou intend to purchase '
                    + amountOfItemsToBePurchased + ' of ' + cartItem.items[0].title
                    + ' items but there are only '
                    + itemsAvailableForPurchase
                    + ' available in the store.\nPlease select fewer items. ')
                return;
            }
        });
        return itemAmountToBePurchasedLowerOrEqualNumberAvailableForPurchase;
    }

    prepareAllAddressesForBuyer(addressResponse: GetAddressesResponse): AddressDTO[] {
        return addressResponse.addresses
            .sort((address1: AddressDTO, address2: AddressDTO): number =>
                address1.addressId > address2.addressId ? 1 : -1);
    }
}
