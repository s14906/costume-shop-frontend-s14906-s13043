import { Component } from '@angular/core';
import {HttpService} from "../../core/service/http.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  nick: string;
  password: string;
  address: string;
  email: string;
  phoneNumber: any;

  constructor(private httpService: HttpService) {
  }

  onSubmit() {
    console.log(this.email);
    this.httpService.postRegistration({
      email: this.email,
      name: 'name',
      surname: 'surname',
      password: this.password
    }).subscribe(x => console.log(x));
  }
}
