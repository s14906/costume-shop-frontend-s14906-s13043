import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {of, Subscription, switchMap} from "rxjs";
import {StorageService} from "../../../core/service/storage.service";
import {
    AddressDTO,
    CartItemDTO,
} from "../../../shared/models/dto.models";
import {CartService} from "../../../core/service/cart.service";
import {HttpService} from "../../../core/service/http/http.service";
import {CartResponse, GetAddressesResponse} from "../../../shared/models/rest.models";
import {CartConfirmationDataModel, UserModel} from "../../../shared/models/data.models";
import {Router} from "@angular/router";
import {SnackbarService} from "../../../core/service/snackbar.service";

@Component({
    selector: 'app-cart-confirmation',
    templateUrl: './cart-confirmation.component.html',
    styleUrls: ['./cart-confirmation.component.css']
})
export class CartConfirmationComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    allAddresses: AddressDTO[] = [];
    currentUser: UserModel;
    totalPrice: number = 0;
    @ViewChild('notesTextarea') notesTextarea!: ElementRef;
    public selectedAddress: AddressDTO;
    private cartItems: CartItemDTO[];
    loading: boolean = true;

    constructor(private storageService: StorageService,
                private httpService: HttpService,
                private cartService: CartService,
                private snackbarService: SnackbarService,
                private router: Router) {
        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.httpService.getCartByUserId(this.currentUser.id)
                .pipe(
                    switchMap((cartResponse: CartResponse) => {
                        if (cartResponse.cartItems.length === 0) {
                            this.router.navigate(['/']);
                            return of(null);
                        } else {
                            const cartConfirmationData: CartConfirmationDataModel
                                = this.cartService.prepareCartConfirmationData(cartResponse);
                            this.totalPrice = cartConfirmationData.totalPrice + 19.99;
                            this.cartItems = cartConfirmationData.cartItems;
                            return this.httpService.getAddressesByUserId(this.currentUser.id);
                        }
                    }))
                .subscribe((addressResponse: GetAddressesResponse | null): void => {
                    if (addressResponse === null) {
                        this.router.navigate(['/']);
                    } else {
                        this.allAddresses = this.cartService.prepareAllAddressesForBuyer(addressResponse);
                    }
                    this.loading = false;
                }));
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    fillNotesForSelectedAddress(address: AddressDTO): void {
        this.selectedAddress = address;
        this.notesTextarea.nativeElement.value = address.notes;
    }

    commencePayment(): void {
        this.loading = true;
        if (this.selectedAddress) {
            this.cartService.commencePayment(this, this.selectedAddress, this.totalPrice,
                this.cartItems, this.allSubscriptions);
        }
        else {
            this.snackbarService.openSnackBar("You must select the delivery address first.")
            this.loading = false;
        }
    }
}
