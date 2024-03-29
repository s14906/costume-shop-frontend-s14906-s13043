import {Component} from '@angular/core';

import {AccountService} from "../../core/service/account.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    email: string;
    password: string;
    loading: boolean = false;

    constructor(private accountService: AccountService) {
    }

    onSubmit(): void {
        this.loading = true;
        this.accountService.logUserIn(this.email, this.password);
        this.loading = false;
    }
}
