import { Component } from '@angular/core';
import {SnackbarService} from "./core/service/snackbar.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CostumeShop';

  constructor(private snackbarService: SnackbarService) {
    const reloadFlag: string | null = localStorage.getItem('reloadFlag');
    const snackbarMessage: string | null = localStorage.getItem('snackbarMessage');
    if (reloadFlag && snackbarMessage) {
      localStorage.setItem('reloadFlag', 'false');
      localStorage.removeItem('snackbarMessage');
      this.snackbarService.openSnackBar(snackbarMessage);
    }
  }
}
