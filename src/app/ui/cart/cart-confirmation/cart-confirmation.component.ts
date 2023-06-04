import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {StorageService} from "../../../core/service/storage.service";
import {HttpService} from "../../../core/service/http/http.service";
import {
    AddressDTO,
    CartConfirmationDTO,
    CartItemDTO,
} from "../../../shared/models/dto.models";
import {CartResponse} from "../../../shared/models/rest.models";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {HttpErrorService} from "../../../core/service/http/http-error.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-cart-confirmation',
    templateUrl: './cart-confirmation.component.html',
    styleUrls: ['./cart-confirmation.component.css']
})
export class CartConfirmationComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    allAddresses: AddressDTO[] = [];
    currentUser;
    totalPrice: number = 0;
    @ViewChild('notesTextarea') notesTextarea!: ElementRef;
    private selectedAddress: AddressDTO;
    private cartItems: CartItemDTO[];

    constructor(private storageService: StorageService,
                private snackbarService: SnackbarService,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private router: Router) {
        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.httpService.getCartByUserId(this.currentUser.id)
                .pipe(
                    switchMap((cartResponse: CartResponse) => {
                        this.cartItems = cartResponse.cartItems;
                        this.cartItems.forEach((cartItem: CartItemDTO) => {
                            this.totalPrice = this.totalPrice + (cartItem.price * cartItem.items.length);
                        });
                        return this.httpService.getAddressesForUser(this.currentUser.id);
                    }))
                .subscribe(addressResponse => {
                    this.allAddresses = addressResponse.addresses
                        .sort((address1: AddressDTO, address2: AddressDTO) =>
                            address1.addressId > address2.addressId ? 1 : -1);
                }));
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    fillNotesForSelectedAddress(address: AddressDTO): void {
        this.selectedAddress = address;
        this.notesTextarea.nativeElement.value = address.notes;
    }

    commencePayment(): void {
        if (this.selectedAddress) {
            const cartConfirmationDTO: CartConfirmationDTO = {
                userId: this.currentUser.id,
                paidAmount: this.totalPrice,
                address: this.selectedAddress,
                cartItems: this.cartItems
            }

            this.allSubscriptions.push(
                this.httpService.postCreateNewOrderPaymentTransaction(cartConfirmationDTO)
                    .subscribe({
                        next: next => {
                            this.snackbarService.openSnackBar(next.message);
                            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                                this.router.navigate(['/']);
                            });
                        },
                        error: err => {
                            this.httpErrorService.handleError(err);
                        }
                    })
            );
        }
    }
}
