import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../../core/service/http.service";
import {StorageService} from "../../../core/service/storage.service";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {Subscription} from "rxjs";
import {OrderDTO} from "../../../shared/models/dto.models";
import { formatDate } from 'src/app/shared/utils';
import {Router} from "@angular/router";

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    private currentUser;
    currentPage: number = 0;
    itemsPerPage: number = 10;
    orders: OrderDTO[] = [];
    pageTitle: string;

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private httpErrorService: HttpErrorService,
                private router: Router) {

        this.currentUser = this.storageService.getUser();

        if (this.currentUser.roles.includes('EMPLOYEE') && this.router.url.includes('orders/all')) {
          this.allSubscriptions.push(
            this.httpService.getAllOrders()
              .subscribe({
                next: next => {
                  this.orders = next.orders;
                  this.pageTitle = 'ALL ORDERS';
                },
                error: err => {
                  this.httpErrorService.handleError(err);
                }
              })
          );
        } else {
          this.allSubscriptions.push(
            this.httpService.getAllOrdersForUser(this.currentUser.id)
              .subscribe({
                next: next => {
                  this.orders = next.orders;
                  this.pageTitle = 'YOUR ORDERS';
                },
                error: err => {
                  this.httpErrorService.handleError(err);
                }
              })
          );
        }

    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    formatDate(createdDate: Date) {
        return formatDate(createdDate);
    }

    navigateToDetails(order: OrderDTO) {
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
