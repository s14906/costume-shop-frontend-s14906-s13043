import {Component, OnDestroy} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../../core/service/http.service";
import {ComplaintDTO, OrderDetailsDTO} from "../../../shared/models/dto.models";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {StorageService} from "../../../core/service/storage.service";
import {formatDate} from "../../../shared/utils";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnDestroy {
  private allSubscriptions: Subscription[] = [];
  orderId: string;
  orderDetails: OrderDetailsDTO;
  complaint: ComplaintDTO;
  currentUser;

  constructor(private route: ActivatedRoute,
              private httpService: HttpService,
              private httpErrorService: HttpErrorService,
              private storageService: StorageService,
              private router: Router) {

    this.currentUser = this.storageService.getUser();
    this.allSubscriptions.push(
      this.route.queryParams.pipe(
        switchMap((queryParam) => {
          this.orderId = queryParam['orderId'];
          return this.httpService.getOrderDetails(this.orderId);
        })
      ).subscribe({
        next: next => {
          if (!this.currentUser.roles.includes('EMPLOYEE') && this.currentUser.id !== next.buyerId) {
            this.router.navigate(['/']);
          } else {
            this.orderDetails = next;
            this.complaint = this.orderDetails.complaint;
            this.storageService.saveOrderDetails(this.orderDetails);
          }
        },
        error: err => {
          this.httpErrorService.handleError(err);
        }
      }));
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  navigateToComplaintCreation() {
    this.storageService.saveOrderDetails(this.orderDetails);
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
  protected readonly formatDate = formatDate;
}
