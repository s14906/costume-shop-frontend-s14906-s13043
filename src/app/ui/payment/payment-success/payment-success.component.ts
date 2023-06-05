import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {StorageService} from "../../../core/service/storage.service";
import {HttpService} from "../../../core/service/http/http.service";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {ItemDTO} from "../../../shared/models/dto.models";
import {HttpErrorService} from "../../../core/service/http/http-error.service";

@Component({
    selector: 'app-payment-success',
    templateUrl: './payment-success.component.html',
    styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    paymentTransactionId: number;
    currentUser;
    items: ItemDTO[] = [];

    constructor(private route: ActivatedRoute,
                private storageService: StorageService,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private snackbarService: SnackbarService,
                private router: Router) {
        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap( (queryParam: Params) => {
                this.paymentTransactionId = queryParam['paymentTransactionId'];
                if (!this.paymentTransactionId) {
                    this.router.navigate(['/']);
                }
                return this.httpService.getItemsByPaymentTransactionId(this.paymentTransactionId);
            })).subscribe({
                next: next => {
                    if (!next.items || next.items.length === 0) {
                        this.router.navigate(['/']).then((navigated: boolean) => {
                            if (navigated) {
                                this.snackbarService.openSnackBar(next.message);
                            }
                        });
                    } else {
                        this.items = next.items;
                    }
                },
                error: err => {
                    this.httpErrorService.handleError(err);
                    this.router.navigate(['/']);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

}
