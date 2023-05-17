import {Component, HostListener, OnDestroy} from '@angular/core';
import {TokenStorageService} from "../../../core/service/token-storage.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable, of, Subscription} from "rxjs";
import {HttpService} from "../../../core/service/http.service";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {AddressModel} from "../../../shared/models/data.models";
import {FormValidationService} from "../../../core/service/form-validation.service";

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
  //TODO: user model
  user: any;
  addresses: AddressModel[] = [];

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setGridColumnNumber()
  }


  constructor(private tokenStorageService: TokenStorageService,
              private formBuilder: FormBuilder,
              private httpService: HttpService,
              private snackbarService: SnackbarService,
              private formValidationService: FormValidationService) {
    this.setGridColumnNumber();
    this.user = this.tokenStorageService.getUser();

    this.addAddressForm = this.formBuilder.group({
        street: ['', Validators.required, this.validateField],
        flatNumber: ['', Validators.required, this.validateField],
        postalCode: ['', Validators.required, this.validateField],
        city: ['', Validators.required, this.validateField]
      },
      {validators: [this.formValidationService.validatePasswords], updateOn: "submit"}
    );

    this.changePasswordForm = this.formBuilder.group({
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {updateOn: "submit"}
    );

    this.allSubscriptions.push(
      this.httpService.getAddressesForUser(this.user.id)
        .subscribe(response => this.addresses = response.addresses));
  }

  private setGridColumnNumber() {
    if (window.innerWidth < 960) {
      this.columnNumber = 1;
    } else {
      this.columnNumber = 2;
    }
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
          userId: this.user.id,
          street: this.getFieldValue('street'),
          flatNumber: this.getFieldValue('flatNumber'),
          postalCode: this.getFieldValue('postalCode'),
          city: this.getFieldValue('city'),
        }).subscribe({
          next: next => {
            this.snackbarService.openSnackBar(next.message);
          },
          error: err => {
            this.snackbarService.openSnackBar(err.error.message);
          }
        }));
    }
  }

  private getFieldValue(fieldName: string) {
    return this.addAddressForm.get(fieldName)?.value;
  }

  //TODO: password change handling
  onSubmitChangePassword() {


  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
