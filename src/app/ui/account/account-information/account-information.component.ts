import {Component, OnDestroy} from '@angular/core';
import {StorageService} from "../../../core/service/storage.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {HttpService} from "../../../core/service/http/http.service";
import {UserModel} from "../../../shared/models/data.models";
import {FormValidationService} from "../../../core/service/form/form-validation.service";
import {AddressDTO} from "../../../shared/models/dto.models";
import {AccountService} from "../../../core/service/account.service";
import {GetAddressesResponse} from "../../../shared/models/rest.models";

@Component({
    selector: 'app-account-information',
    templateUrl: './account-information.component.html',
    styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnDestroy {
    addAddressForm: FormGroup;
    changePasswordForm: FormGroup;
    allSubscriptions: Subscription[] = [];
    columnNumber: number = 0;
    password: string;
    currentUser: UserModel;
    addresses: AddressDTO[] = [];
    loading: boolean = true;

    constructor(private storageService: StorageService,
                private formBuilder: FormBuilder,
                private httpService: HttpService,
                private formValidationService: FormValidationService,
                private accountService: AccountService) {
        this.setGridColumnNumber();
        this.currentUser = this.storageService.getUser();

        this.addAddressForm = this.formBuilder.group({
                street: ['', Validators.required, this.formValidationService.validateField],
                flatNumber: ['', Validators.required, this.formValidationService.validateField],
                postalCode: ['', Validators.required, this.formValidationService.validateField],
                city: ['', Validators.required, this.formValidationService.validateField]
            },
            {updateOn: "submit"}
        );

        this.changePasswordForm = this.formBuilder.group({
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required]
            },
            {validators: [this.formValidationService.validatePasswords], updateOn: "submit"}
        );

        this.allSubscriptions.push(
            this.httpService.getAddressesForUser(this.currentUser.id)
                .subscribe((response: GetAddressesResponse): void => {
                    this.addresses = response.addresses;
                    this.loading = false;
                }));
    }

    onSubmitAddAddress(): void {
        this.accountService.addAddress(this.addAddressForm, this.currentUser, this.allSubscriptions);
    }

    onSubmitChangePassword(): void {
        this.accountService.changePassword(this.changePasswordForm, this.currentUser);

    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    removeAddress(addressId: number): void {
        this.accountService.removeAddress(addressId, this.allSubscriptions);
    }

    private setGridColumnNumber(): void {
        if (window.innerWidth < 960) {
            this.columnNumber = 1;
        } else {
            this.columnNumber = 2;
        }
    }

}
