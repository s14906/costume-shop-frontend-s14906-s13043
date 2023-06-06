import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {FormValidationService} from "../../core/service/form/form-validation.service";
import {AccountService} from "../../core/service/account.service";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnDestroy {
    registrationForm: FormGroup;
    allSubscriptions: Subscription[] = [];
    loading: boolean = false;

    constructor(private formBuilder: FormBuilder,
                private formValidationService: FormValidationService,
                private accountService: AccountService) {
        this.registrationForm = this.formBuilder.group({
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required],
                email: ['', Validators.required, this.formValidationService.validateField],
                username: ['', Validators.required, this.formValidationService.validateField],
                name: ['', Validators.required, this.formValidationService.validateField],
                surname: ['', Validators.required, this.formValidationService.validateField],
                street: ['', Validators.required, this.formValidationService.validateField],
                flatNumber: ['', Validators.required, this.formValidationService.validateField],
                postalCode: ['', Validators.required, this.formValidationService.validateField],
                phone: ['', Validators.required, this.formValidationService.validateField],
                city: ['', Validators.required, this.formValidationService.validateField]
            },
            {validators: [this.formValidationService.validatePasswords], updateOn: "submit"}
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    onSubmitRegistrationForm(): void {
        this.loading = true;
        this.loading = this.accountService.registerUser(this.registrationForm, this.allSubscriptions);
    }
}
