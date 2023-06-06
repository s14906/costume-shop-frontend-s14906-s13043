import {Injectable} from "@angular/core";
import {FormValidationService} from "./form/form-validation.service";
import {FormGroup} from "@angular/forms";
import {SnackbarService} from "./snackbar.service";
import {HttpService} from "./http/http.service";
import {Router} from "@angular/router";
import {HttpErrorService} from "./http/http-error.service";
import {UserModel} from "../../shared/models/data.models";
import {Subscription} from "rxjs";
import {AuthService} from "./auth/auth.service";
import {StorageService} from "./storage.service";
import {AddressDTO} from "../../shared/models/dto.models";
import {SimpleResponse, UserResponse} from "../../shared/models/rest.models";

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(private formValidationService: FormValidationService,
                private snackbarService: SnackbarService,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private authService: AuthService,
                private storageService: StorageService,
                private router: Router) {
    }

    addAddress(addAddressForm: FormGroup, user: UserModel, allSubscriptions: Subscription[]): void {
        if (this.formValidationService.isFormValid(addAddressForm)) {
            allSubscriptions.push(
                this.httpService.postAddAddress({
                    addressId: 0,
                    userId: user.id,
                    street: this.formValidationService.getFieldValue(addAddressForm, 'street'),
                    flatNumber: this.formValidationService.getFieldValue(addAddressForm, 'flatNumber'),
                    postalCode: this.formValidationService.getFieldValue(addAddressForm, 'postalCode'),
                    city: this.formValidationService.getFieldValue(addAddressForm, 'city'),
                }).subscribe({
                    next: next => {
                        this.snackbarService.openSnackBar(next.message);
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then((): void => {
                            this.router.navigate(['account']);
                        });
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                }));
        }
    }

    changePassword(changePasswordForm: FormGroup, user: UserModel): void {
        if (this.formValidationService.isFormValid(changePasswordForm)) {
            this.httpService.postChangePassword(user.id,
                this.formValidationService.getFieldValue(changePasswordForm, 'password'))
                .subscribe({
                    next: (next: SimpleResponse): void => {
                        this.snackbarService.openSnackBar(next.message)
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        }
    }

    removeAddress(addressId: number, allSubscriptions: Subscription[]): void {
        allSubscriptions.push(
            this.httpService.postRemoveAddress(addressId).subscribe({
                next: (next: SimpleResponse): void => {
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

    logUserIn(email: string, password: string): void {
        this.authService.login(email, password).subscribe({
            next: (next: UserResponse): void => {
                if (next.user.token) {
                    this.storageService.saveToken(next.user.token);
                    this.storageService.saveUser(next.user);
                }

                this.snackbarService.openSnackBar(next.message);
                this.router.navigate(['/']);
            },
            error: err => {
                this.snackbarService.openSnackBar(err.error.message);
            }
        });
    }

    registerUser(registrationForm: FormGroup, allSubscriptions: Subscription[]): boolean {
        let loading: boolean = true;
        if (this.formValidationService.isFormValid(registrationForm)) {
            const address: AddressDTO = {
                addressId: 0,
                street: this.formValidationService.getFieldValue(registrationForm, 'street'),
                flatNumber: this.formValidationService.getFieldValue(registrationForm, 'flatNumber'),
                postalCode: this.formValidationService.getFieldValue(registrationForm, 'postalCode'),
                city: this.formValidationService.getFieldValue(registrationForm, 'city')
            }
            allSubscriptions.push(
                this.httpService.postRegistration({
                    username: this.formValidationService.getFieldValue(registrationForm, 'username'),
                    email: this.formValidationService.getFieldValue(registrationForm, 'email'),
                    name: this.formValidationService.getFieldValue(registrationForm, 'name'),
                    surname: this.formValidationService.getFieldValue(registrationForm, 'surname'),
                    password: this.formValidationService.getFieldValue(registrationForm, 'password'),
                    address: address,
                    phone: this.formValidationService.getFieldValue(registrationForm, 'phone')
                }).subscribe({
                    next: (next: SimpleResponse): void => {
                        this.snackbarService.openSnackBar(next.message);
                        this.router.navigate(['/registration-success']);
                        loading = false;
                    },
                    error: err => {
                        this.snackbarService.openSnackBar(err.error.message);
                        loading = false;
                    }
                }));

        }
        return loading;
    }
}
