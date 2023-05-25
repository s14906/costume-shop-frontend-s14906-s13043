import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../../core/service/http.service";
import {TokenStorageService} from "../../../core/service/token-storage.service";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {Subscription} from "rxjs";
import {OrderHistoryDTO} from "../../../shared/models/dto.models";
import { formatDate } from 'src/app/shared/utils';
import {Router} from "@angular/router";

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    private currentUser;
    orders: OrderHistoryDTO[] = [];

    constructor(private httpService: HttpService,
                private tokenStorageService: TokenStorageService,
                // private snackbarService: SnackbarService,
                private httpErrorService: HttpErrorService,
                private router: Router) {

        this.currentUser = this.tokenStorageService.getUser();
        this.allSubscriptions.push(
            this.httpService.getAllOrdersForUser(this.currentUser.id)
                .subscribe({
                    next: next => {
                        this.orders = next;
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    formatDate(createdDate: Date) {
        return formatDate(createdDate);
    }

    navigateToDetails(order: OrderHistoryDTO) {
        this.router.navigate(['orders/details'], {
            queryParams: {
                orderId: order.orderId
            }
        });
    }
}
