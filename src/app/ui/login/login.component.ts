import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../../core/service/auth.service";
import {HeaderRefreshService} from "../../core/service/header-refresh.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginValid: boolean = true;
  email: string;
  password: string;
  private invalidLogin: boolean;
  private loginSuccess: boolean;

  constructor(private authService: AuthService, private commonService: HeaderRefreshService,
              private http: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    sessionStorage.setItem('token', '');
  }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe((result)=> {
      this.invalidLogin = false;
      this.loginSuccess = true;
      this.commonService.sendUpdate();
      this.router.navigate(['/']);
    }, () => {
      this.invalidLogin = true;
      this.loginSuccess = false;
    });
  }
}
