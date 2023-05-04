import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../core/service/http.service";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SnackbarService} from "../../core/service/snackbar.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

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
      email: ['', Validators.required],
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      surname: ['', Validators.required]
    },
      { validators: [this.validateForm], updateOn: "submit" }
    );
  }

  ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

  validateForm(control: AbstractControl) {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');

    if ((passwordControl?.value !== confirmPasswordControl?.value) ||
      (passwordControl?.value === '' || confirmPasswordControl?.value === '')) {
      passwordControl?.setErrors( {invalid: true});
      confirmPasswordControl?.setErrors( {invalid: true});
    } else {
      passwordControl?.setErrors(null);
      confirmPasswordControl?.setErrors(null);
    }

    const emailControl = control.get('email');
    if (emailControl?.value === '') {
      emailControl?.setErrors({invalid: true});
    } else {
      emailControl?.setErrors(null);
    }

    const usernameControl = control.get('username');
    if (usernameControl?.value === '') {
      usernameControl?.setErrors({invalid: true});
    } else {
      usernameControl?.setErrors(null);
    }

    const firstnameControl = control.get('firstname');
    if (firstnameControl?.value === '') {
      firstnameControl?.setErrors({invalid: true});
    } else {
      firstnameControl?.setErrors(null);
    }

    const surnameControl = control.get('surname');
    if (surnameControl?.value === '') {
      surnameControl?.setErrors({invalid: true});
    } else {
      surnameControl?.setErrors(null);
    }

    return null;
  }


  onSubmit() {
    let formValid: boolean = true;
    Object.keys(this.registrationForm.controls).forEach(key => {
      if(this.registrationForm.get(key)?.errors) {
        formValid = false;
        return;
      }
    });
    if (formValid) {
      this.allSubscriptions.push(
        this.httpService.postRegistration({
          username: this.registrationForm.get('username')?.value,
          email: this.registrationForm.get('email')?.value,
          name: this.registrationForm.get('name')?.value,
          surname: this.registrationForm.get('surname')?.value,
          password: this.registrationForm.get('password')?.value
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
}
