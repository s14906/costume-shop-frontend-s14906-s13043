import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {StorageService} from "../../../core/service/storage.service";
import {
    AddressDTO,
    CartItemDTO,
} from "../../../shared/models/dto.models";
import {CartService} from "../../../core/service/cart.service";
import {HttpService} from "../../../core/service/http/http.service";
import {CartResponse, GetAddressesResponse} from "../../../shared/models/rest.models";
import {CartConfirmationDataModel} from "../../../shared/models/data.models";

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
                private httpService: HttpService,
                private cartService: CartService) {
        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.httpService.getCartByUserId(this.currentUser.id)
                .pipe(
                    switchMap((cartResponse: CartResponse) => {
                        const cartConfirmationData: CartConfirmationDataModel
                            = this.cartService.prepareCartConfirmationData(cartResponse);
                        this.totalPrice = cartConfirmationData.totalPrice;
                        this.cartItems = cartConfirmationData.cartItems;
                        return this.httpService.getAddressesForUser(this.currentUser.id);
                    }))
                .subscribe((addressResponse: GetAddressesResponse) => {
                    this.allAddresses = this.cartService.prepareAllAddressesForBuyer(addressResponse);
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
        this.cartService.commencePayment(this.selectedAddress, this.totalPrice,
            this.cartItems, this.allSubscriptions);
    }
}
