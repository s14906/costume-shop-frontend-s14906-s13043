import {Component, OnDestroy} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../../core/service/http/http.service";
import {ComplaintDTO, ItemDTO, OrderDetailsDTO, OrderStatusDTO, UserDTO} from "../../../shared/models/dto.models";
import {HttpErrorService} from "../../../core/service/http/http-error.service";
import {StorageService} from "../../../core/service/storage.service";
import {formatDate} from "../../../shared/utils";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {OrderDetailsResponse, OrderStatusResponse, UserResponse} from "../../../shared/models/rest.models";
import {UserModel} from "../../../shared/models/data.models";

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    orderId: string;
    orderDetails: OrderDetailsDTO;
    orderDate: Date;
    complaint: ComplaintDTO;
    currentUser: UserModel;
    orderStatuses: OrderStatusDTO[] = []
    selectedOrderStatus: string;
    buyer: UserDTO;
    loading: boolean = true;

    constructor(private route: ActivatedRoute,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private storageService: StorageService,
                private snackbarService: SnackbarService,
                private router: Router) {

        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParam) => {
                    this.orderId = queryParam['orderId'];
                    return this.httpService.getOrderDetailsByOrderId(this.orderId);
                })
            ).subscribe({
                next: (next: OrderDetailsResponse): void => {
                    if (!next.orderDetails) {
                        this.router.navigate(['/']).then((navigated: boolean) => {
                            if (navigated) {
                                this.snackbarService.openSnackBar('Could not find order with this ID.');
                            }
                        });
                    }
                    if (!this.currentUser
                        || (!this.currentUser.roles.includes('EMPLOYEE') && this.currentUser.id !== next.orderDetails.buyerId)) {
                        this.router.navigate(['/']);
                    } else {
                        this.orderDetails = next.orderDetails;
                        this.selectedOrderStatus = this.orderDetails.orderStatus;
                        this.orderDate = this.orderDetails.orderDate;
                        this.complaint = this.orderDetails.complaint;
                    }
                    this.loading = false;
                },
                error: err => {
                    this.httpErrorService.handleError(err);
                }
            }));
        this.allSubscriptions.push(
            this.httpService.getAllOrderStatuses()
                .subscribe({
                    next: (next: OrderStatusResponse): void => {
                        this.orderStatuses = next.orderStatuses;
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        );
        this.allSubscriptions.push(
            this.httpService.getUserByOrderId(this.orderId)
                .subscribe({
                    next: (next: UserResponse): void => {
                        this.buyer = next.user;
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    navigateToComplaintCreation(): void {
        this.router.navigate(['orders/complaint'], {
            queryParams: {
                orderId: this.orderId
            }
        });
    }

    navigateToComplaintChat() {
        const complaintId: string = this.complaint.complaintId.toString();
        this.router.navigate(['/complaints/chat'], {
            queryParams: {
                complaintId: complaintId
            }
        });
    }

    setOrderStatus(orderStatus: OrderStatusDTO): void {
        this.selectedOrderStatus = orderStatus.status;
    }

    protected readonly formatDate = formatDate;

    navigateToItem(item: ItemDTO): void {
        this.router.navigate(['item'], {
            queryParams: {
                itemId: item.itemId
            }
        })
    }


    updateOrderStatusForOrder(): void {
        this.loading = true;
        if (this.selectedOrderStatus !== this.orderDetails.orderStatus) {
            const orderStatus: OrderStatusDTO | undefined
                = this.orderStatuses.find((orderStatus: OrderStatusDTO) =>
                orderStatus.status === this.selectedOrderStatus);
            if (orderStatus) {
                orderStatus.orderId = this.orderId;
                this.httpService.postUpdateOrderStatusForOrder(orderStatus)
                    .subscribe({
                        next: next => {
                            this.snackbarService.openSnackBar(next.message);
                            this.loading = false;
                        },
                        error: err => {
                            this.httpErrorService.handleError(err);
                            this.loading = false;
                        }
                    })
            }
        }
    }
}
