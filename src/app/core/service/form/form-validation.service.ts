import {Injectable} from "@angular/core";
import {AbstractControl, FormGroup, ValidationErrors} from "@angular/forms";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  public validatePasswords(formGroup: FormGroup) {
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

  public validateNumber(numberControl: AbstractControl): Observable<ValidationErrors | null> {
    if (isNaN(numberControl?.value)) {
      return of({invalid: true})
    } else {
      return of(null);
    }
  }

  validateField(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control?.value === '') {
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
