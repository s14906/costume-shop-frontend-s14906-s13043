import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../../core/service/http.service";
import {StorageService} from "../../../core/service/storage.service";
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
    currentPage = 0;
    itemsPerPage = 10;
    orders: OrderHistoryDTO[] = [];

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private httpErrorService: HttpErrorService,
                private router: Router) {

        this.currentUser = this.storageService.getUser();
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
  get paginatedOrders() {
    const begin = this.currentPage * this.itemsPerPage;
    const end = begin + this.itemsPerPage;
    return this.orders.slice(begin, end);
  }

  noOrders() {
    return this.orders.length === 0;
  }
}
