import {Injectable} from "@angular/core";
import {AbstractControl, FormGroup, ValidationErrors} from "@angular/forms";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  public validatePasswords(formGroup: FormGroup): null {
    const passwordControl: AbstractControl<any, any> | null = formGroup.get('password');
    const confirmPasswordControl: AbstractControl<any, any> | null = formGroup.get('confirmPassword');

    const passwordInput: string = passwordControl?.value;

    const regex: RegExp = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/);
    const passwordMatchesRegex: boolean = regex.test(passwordInput);

    if ((passwordControl?.value !== confirmPasswordControl?.value) ||
      (passwordControl?.value === '' || confirmPasswordControl?.value === '') ||
        !passwordMatchesRegex) {
      passwordControl?.setErrors({invalid: true});
      confirmPasswordControl?.setErrors({invalid: true});
    } else {
      passwordControl?.setErrors(null);
      confirmPasswordControl?.setErrors(null);
    }
    return null;
  }

  public validateNumber(numberControl: AbstractControl): Observable<ValidationErrors | null> {
    if (isNaN(numberControl?.value)) {
      return of({invalid: true})
    } else {
      return of(null);
    }
  }

  validateFieldNotEmpty(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control?.value === '') {
      return of({invalid: true})
    } else {
      return of(null);
    }
  }

  validatePhoneNumber(phoneNumberControl: AbstractControl): Observable<ValidationErrors | null> {
    const phoneNumberInput: string = phoneNumberControl?.value;
    const regex: RegExp = new RegExp(/^\d{3}-\d{3}-\d{3}$/);

    if (phoneNumberInput === '' || !regex.test(phoneNumberInput)) {
      return of({invalid: true})
    } else {
      return of(null);
    }
  }


  public isFormValid(form: FormGroup): boolean {
    let errorCount: number = 0;
    Object.keys(form.controls).forEach(key => {
      if (form.get(key)?.errors) {
        errorCount++;
      }
    });
    return errorCount === 0;
  }

  getFieldValue(form: FormGroup, fieldName: string) {
    return form.get(fieldName)?.value;
  }
}
