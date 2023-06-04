import {Component, HostListener, OnDestroy} from '@angular/core';
import {StorageService} from "../../../core/service/storage.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable, of, Subscription} from "rxjs";
import {HttpService} from "../../../core/service/http/http.service";
import { UserModel} from "../../../shared/models/data.models";
import {FormValidationService} from "../../../core/service/form/form-validation.service";
import {AddressDTO} from "../../../shared/models/dto.models";
import {AccountService} from "../../../core/service/account.service";

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
    user: UserModel;
    addresses: AddressDTO[] = [];

    constructor(private storageService: StorageService,
                private formBuilder: FormBuilder,
                private httpService: HttpService,
                private formValidationService: FormValidationService,
                private accountService: AccountService) {
        this.setGridColumnNumber();
        this.user = this.storageService.getUser();

        this.addAddressForm = this.formBuilder.group({
                street: ['', Validators.required, this.validateField],
                flatNumber: ['', Validators.required, this.validateField],
                postalCode: ['', Validators.required, this.validateField],
                city: ['', Validators.required, this.validateField]
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
            this.httpService.getAddressesForUser(this.user.id)
                .subscribe(response => this.addresses = response.addresses));
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.setGridColumnNumber()
    }

    validateField(control: AbstractControl): Observable<ValidationErrors | null> {
        if (control?.value === '') {
            return of({invalid: true})
        } else {
            return of(null);
        }
    }

    onSubmitAddAddress() {
        this.accountService.addAddress(this.addAddressForm, this.user, this.allSubscriptions);
    }

    onSubmitChangePassword() {
        this.accountService.changePassword(this.changePasswordForm, this.user);

    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    removeAddress(addressId: number) {
        this.accountService.removeAddress(addressId, this.allSubscriptions);
    }

    private setGridColumnNumber() {
        if (window.innerWidth < 960) {
            this.columnNumber = 1;
        } else {
            this.columnNumber = 2;
        }
    }

}
