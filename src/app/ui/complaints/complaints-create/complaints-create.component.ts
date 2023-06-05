import {Component} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ItemDTO, OrderDetailsDTO} from "../../../shared/models/dto.models";
import {ActivatedRoute, Params} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {HttpService} from "../../../core/service/http/http.service";
import {HttpErrorService} from "../../../core/service/http/http-error.service";

@Component({
  selector: 'app-complaints-create',
  templateUrl: './complaints-create.component.html',
  styleUrls: ['./complaints-create.component.css']
})
export class ComplaintsCreateComponent {

  private allSubscriptions: Subscription[] = [];
  orderDetails: OrderDetailsDTO;
  displayedColumns: string[] = ['itemId', 'title', 'description', 'price'];
  dataSource: MatTableDataSource<ItemDTO>;


  constructor(
    private httpService: HttpService,
    private httpErrorService: HttpErrorService,
    private route: ActivatedRoute) {
    this.allSubscriptions.push(
      this.route.queryParams.pipe(
          switchMap((queryParams: Params) => {
          const orderId: string = queryParams['orderId'];
          return this.httpService.getOrderDetails(orderId);
      })).subscribe({
          next: next => {
              this.orderDetails = next.orderDetails
              this.dataSource = new MatTableDataSource(this.orderDetails.items);
          },
          error: err => {
              this.httpErrorService.handleError(err);
          }
      }));
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }


}
