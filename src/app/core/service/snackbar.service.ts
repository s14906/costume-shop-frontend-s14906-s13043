import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private snackbarQueue: string[] = [];

    constructor(private snackbar: MatSnackBar) {
    }

    public openSnackBar(message: string): void {
        this.snackbarQueue.push(message);

        if (this.snackbarQueue.length === 1) {
            this.displayNextSnackbar();
        }
    }

    displayNextSnackbar() {
        const snackbarMessage = this.snackbarQueue[0];
        this.snackbar.open(snackbarMessage, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
        }).afterDismissed().subscribe(() => {
            this.removeSnackbarFromQueue();
        });
    }

    removeSnackbarFromQueue() {
        this.snackbarQueue.shift();
        if (this.snackbarQueue.length > 0) {
            this.displayNextSnackbar();
        }
    }
}
