import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../core/service/http.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {SnackbarService} from "../../core/service/snackbar.service";
import {Router} from "@angular/router";
import {Observable, of, Subscription} from "rxjs";
import {FormValidationService} from "../../core/service/form-validation.service";
import {AddressDTO} from "../../shared/models/dto.models";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnDestroy {
    registrationForm: FormGroup;

    allSubscriptions: Subscription[] = [];

    constructor(private httpService: HttpService,
                private snackbarService: SnackbarService,
                private formBuilder: FormBuilder,
                private formValidationService: FormValidationService,
                private router: Router) {
        this.registrationForm = this.formBuilder.group({
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required],
                email: ['', Validators.required, this.validateField],
                username: ['', Validators.required, this.validateField],
                name: ['', Validators.required, this.validateField],
                surname: ['', Validators.required, this.validateField],
                street: ['', Validators.required, this.validateField],
                flatNumber: ['', Validators.required, this.validateField],
                postalCode: ['', Validators.required, this.validateField],
                phone: ['', Validators.required, this.validateField],
                city: ['', Validators.required, this.validateField]
            },
            {validators: [this.formValidationService.validatePasswords], updateOn: "submit"}
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    validateField(control: AbstractControl): Observable<ValidationErrors | null> {
        if (control?.value === '') {
            return of({invalid: true})
        } else {
            return of(null);
        }
    }

    onSubmitRegistrationForm() {
        if (this.formValidationService.isFormValid(this.registrationForm)) {
            const address: AddressDTO = {
                addressId: 0,
                street: this.getFieldValue('street'),
                flatNumber: this.getFieldValue('flatNumber'),
                postalCode: this.getFieldValue('postalCode'),
                city: this.getFieldValue('city')
            }
            this.allSubscriptions.push(
                this.httpService.postRegistration({
                    username: this.getFieldValue('username'),
                    email: this.getFieldValue('email'),
                    name: this.getFieldValue('name'),
                    surname: this.getFieldValue('surname'),
                    password: this.getFieldValue('password'),
                    address: address,
                    phone: this.getFieldValue('phone')
                }).subscribe({
                    next: next => {
                        this.snackbarService.openSnackBar(next.message);
                        this.router.navigate(['/registration-success']);
                    },
                    error: err => {
                        this.snackbarService.openSnackBar(err.error.message);
                    }
                }));
        }
    }

    private getFieldValue(fieldName: string) {
        return this.registrationForm.get(fieldName)?.value;
    }
}
