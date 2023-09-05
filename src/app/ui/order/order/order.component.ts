import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../../core/service/http/http.service";
import {StorageService} from "../../../core/service/storage.service";
import {HttpErrorService} from "../../../core/service/http/http-error.service";
import {Subscription} from "rxjs";
import {OrderDTO} from "../../../shared/models/dto.models";
import {formatDate} from 'src/app/shared/utils';
import {Router} from "@angular/router";
import {OrderResponse} from "../../../shared/models/rest.models";
import {UserModel} from "../../../shared/models/data.models";

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    private currentUser: UserModel;
    currentPage: number = 0;
    itemsPerPage: number = 10;
    orders: OrderDTO[] = [];
    pageTitle: string;
    loading: boolean = true;

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private httpErrorService: HttpErrorService,
                private router: Router) {

        this.currentUser = this.storageService.getUser();

        if (this.currentUser.roles.includes('EMPLOYEE') && this.router.url.includes('orders/all')) {
            this.allSubscriptions.push(
                this.httpService.getAllOrders()
                    .subscribe({
                        next: (next: OrderResponse): void => {
                          this.orders = next.orders.sort((a: OrderDTO, b: OrderDTO): number =>
                            a.createdDate > b.createdDate ? -1 : 1);
                            this.pageTitle = 'ALL ORDERS';
                            this.loading = false;
                        },
                        error: err => {
                            this.httpErrorService.handleError(err);
                            this.loading = false;

                        }
                    })
            );
        } else {
            this.allSubscriptions.push(
                this.httpService.getAllOrdersByUserId(this.currentUser.id)
                    .subscribe({
                        next: (next: OrderResponse): void => {
                            this.orders = next.orders.sort((a: OrderDTO, b: OrderDTO): number =>
                              a.createdDate > b.createdDate ? -1 : 1);
                            this.pageTitle = 'YOUR ORDERS';
                            this.loading = false;
                        },
                        error: err => {
                            this.httpErrorService.handleError(err);
                            this.loading = false;
                        }
                    })
            );
        }

    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    formatDate(createdDate: Date | undefined): string {
        if (createdDate) {
            return formatDate(createdDate);
        }
        return '';
    }

    navigateToDetails(order: OrderDTO): void {
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

    isNoOrders(): boolean {
        return this.orders.length === 0;
    }
}
