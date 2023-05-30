import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {AuthService} from "./auth.service";
import {SnackbarService} from "./snackbar.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorService {

  constructor(private storageService: StorageService,
              private authService: AuthService,
              private snackbarService: SnackbarService,
              private router: Router) {
  }

  handleError(err: any): void {
    const errorMessage: string = err.error?.message;
    if (err.status === 401) {
      this.reloadOrNavigateToHomeWithSnackbar("Unauthorized access to this resource.");
    } else if (err.status === 403) {
      this.authService.announceLogout();
      this.storageService.signOut();
      this.reloadOrNavigateToHomeWithSnackbar("Your session token has expired. Please log in again.");
    } else {
      if (errorMessage) {
        this.snackbarService.openSnackBar(errorMessage);
      } else {
        this.snackbarService.openSnackBar("An unknown server-side problem has occurred.");
      }
    }
  }

  private reloadOrNavigateToHomeWithSnackbar(snackbarMessage: string) {
    if (this.router.url === '/') {
      localStorage.setItem('reloadFlag', 'true');
      localStorage.setItem('snackbarMessage', snackbarMessage);
      window.location.reload();
    } else {
      this.router.navigate(['/']).then((navigated: boolean) => {
        if (navigated) {
          this.snackbarService.openSnackBar(snackbarMessage);
        }
      });
    }
  }
}
