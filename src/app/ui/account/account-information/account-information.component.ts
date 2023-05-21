import {Component, HostListener, OnDestroy} from '@angular/core';
import {TokenStorageService} from "../../../core/service/token-storage.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable, of, Subscription} from "rxjs";
import {HttpService} from "../../../core/service/http.service";
import {SnackbarService} from "../../../core/service/snackbar.service";
import { UserModel} from "../../../shared/models/data.models";
import {FormValidationService} from "../../../core/service/form-validation.service";
import {Router} from "@angular/router";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {AddressDTO} from "../../../shared/models/dto.models";

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

    constructor(private tokenStorageService: TokenStorageService,
                private formBuilder: FormBuilder,
                private httpService: HttpService,
                private snackbarService: SnackbarService,
                private formValidationService: FormValidationService,
                private router: Router,
                private httpErrorService: HttpErrorService) {
        this.setGridColumnNumber();
        this.user = this.tokenStorageService.getUser();

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
        if (this.formValidationService.isFormValid(this.addAddressForm)) {
            this.allSubscriptions.push(
                this.httpService.postAddAddress({
                    addressId: 0,
                    userId: this.user.id,
                    street: this.getFieldValue(this.addAddressForm, 'street'),
                    flatNumber: this.getFieldValue(this.addAddressForm, 'flatNumber'),
                    postalCode: this.getFieldValue(this.addAddressForm, 'postalCode'),
                    city: this.getFieldValue(this.addAddressForm, 'city'),
                }).subscribe({
                    next: next => {
                        this.snackbarService.openSnackBar(next.message);
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                            this.router.navigate(['account']);
                        });
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                }));
        }
    }

    onSubmitChangePassword() {
        if (this.formValidationService.isFormValid(this.changePasswordForm)) {
            this.httpService.postChangePassword(this.user.id, this.getFieldValue(this.changePasswordForm, 'password'))
                .subscribe({
                    next: next => {
                        this.snackbarService.openSnackBar(next.message)
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        }
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    removeAddress(addressId: number) {
        this.allSubscriptions.push(
            this.httpService.postRemoveAddress(addressId).subscribe({
                next: next => {
                    this.snackbarService.openSnackBar(next.message);
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                        this.router.navigate(['account']);
                    });
                },
                error: err => {
                    this.httpErrorService.handleError(err);
                }
            }));
    }

    private setGridColumnNumber() {
        if (window.innerWidth < 960) {
            this.columnNumber = 1;
        } else {
            this.columnNumber = 2;
        }
    }

    private getFieldValue(form: FormGroup, fieldName: string) {
        return form.get(fieldName)?.value;
    }
}
