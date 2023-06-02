import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {StorageService} from "../../../core/service/storage.service";
import {HttpService} from "../../../core/service/http.service";
import {AddressDTO, CartItemDTO} from "../../../shared/models/dto.models";
import {CartResponse} from "../../../shared/models/rest.models";

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

    constructor(private storageService: StorageService,
                private httpService: HttpService) {
        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.httpService.getCartByUserId(this.currentUser.id)
                .pipe(
                    switchMap((cartResponse: CartResponse) => {
                        cartResponse.cartItems.forEach((cartItem: CartItemDTO) => {
                            this.totalPrice = this.totalPrice + cartItem.price;
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
        this.notesTextarea.nativeElement.value = address.notes;
    }

    commencePayment(): void {
        this.allSubscriptions.push(

        );
    }
}
