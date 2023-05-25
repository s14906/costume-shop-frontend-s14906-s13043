import {Component, OnDestroy} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../core/service/http.service";
import {OrderDetailsDTO} from "../../../shared/models/dto.models";
import {HttpErrorService} from "../../../core/service/http-error.service";

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    orderId: string;
    orderDetails: OrderDetailsDTO;

    constructor(private route: ActivatedRoute,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService) {
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParam) => {
                    this.orderId = queryParam['orderId'];
                    console.log(this.orderId);
                    return this.httpService.getOrderDetails(this.orderId);
                })
            ).subscribe({
                next: next => {
                    this.orderDetails = next
                },
                error: err => {
                    this.httpErrorService.handleError(err);
                }
            }));
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    createComplaint() {

    }
}
