import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../core/service/auth.service";
import {SnackbarService} from "../../core/service/snackbar.service";
import {TokenStorageService} from "../../core/service/token-storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginValid: boolean = true;
  email: string;
  password: string;

  constructor(private authService: AuthService,
              private snackbarService: SnackbarService,
              private tokenStorageService: TokenStorageService,
              private router: Router) {
  }

  roles: string[] = [];

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.roles = this.tokenStorageService.getUser().roles;
    }
  }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: next => {
        this.tokenStorageService.saveToken(next.user.token);
        this.tokenStorageService.saveUser(next.user);

        this.roles = this.tokenStorageService.getUser().roles;
        this.snackbarService.openSnackBar(next.message);
        this.router.navigate(['/']);
      },
      error: err => {
        this.snackbarService.openSnackBar(err.error.message);
      }
    });
  }
}
