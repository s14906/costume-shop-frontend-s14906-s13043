import {Injectable} from "@angular/core";
import {AbstractControl, FormGroup} from "@angular/forms";

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


  public isFormValid(form: FormGroup): boolean {
    let errorCount: number = 0;
    Object.keys(form.controls).forEach(key => {
      if (form.get(key)?.errors) {
        errorCount++;
      }
    });
    return errorCount === 0;
  }
}
