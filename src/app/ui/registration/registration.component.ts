import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../core/service/http.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {SnackbarService} from "../../core/service/snackbar.service";
import {Router} from "@angular/router";
import {Observable, of, Subscription} from "rxjs";

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
              private router: Router) {
    this.registrationForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword :['', Validators.required],
      email: ['', Validators.required, this.validateField],
      username: ['', Validators.required, this.validateField],
      firstname: ['', Validators.required, this.validateField],
      surname: ['', Validators.required, this.validateField],
      street: ['', Validators.required, this.validateField],
      flatNumber: ['', Validators.required, this.validateField],
      postalCode: ['', Validators.required, this.validateField],
      phone: ['', Validators.required, this.validateField],
      city: ['', Validators.required, this.validateField]
    },
      { validators: [this.validatePasswords], updateOn: "submit" }
    );
  }

  ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

  validatePasswords(formGroup: FormGroup) {
    const passwordControl: AbstractControl<any, any> | null = formGroup.get('password');
    const confirmPasswordControl: AbstractControl<any, any> | null = formGroup.get('confirmPassword');

    if ((passwordControl?.value !== confirmPasswordControl?.value) ||
      (passwordControl?.value === '' || confirmPasswordControl?.value === '')) {
      passwordControl?.setErrors({invalid: true});
      confirmPasswordControl?.setErrors({invalid: true});
    } else {
      passwordControl?.setErrors(null);
      confirmPasswordControl?.setErrors(null);
    }
    return null;
  }

  validateField(control: AbstractControl): Observable<ValidationErrors | null> {
        if (control?.value === '') {
          return of({invalid: true})
        } else {
          return of(null);
        }
  }

  onSubmit() {
    let formValid: boolean = true;
    Object.keys(this.registrationForm.controls).forEach(key => {
      if (this.registrationForm.get(key)?.errors) {
        formValid = false;
        return;
      }
    });
    if (formValid) {
      this.allSubscriptions.push(
        this.httpService.postRegistration({
          username: this.getFieldValue('username'),
          email: this.getFieldValue('email'),
          name: this.getFieldValue('name'),
          surname: this.getFieldValue('surname'),
          password: this.getFieldValue('password'),
          street: this.getFieldValue('street'),
          flatNumber: this.getFieldValue('flatNumber'),
          postalCode: this.getFieldValue('postalCode'),
          city: this.getFieldValue('city'),
          phone: this.getFieldValue('phone')
        }).subscribe({
          next: next => {
            this.snackbarService.openSnackBar(next.message);
            this.router.navigate(['/']);
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
