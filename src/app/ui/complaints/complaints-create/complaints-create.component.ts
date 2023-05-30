import {Component} from '@angular/core';
import {Subscription} from "rxjs";
import {ItemWithImageDTO, OrderDetailsDTO} from "../../../shared/models/dto.models";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {StorageService} from "../../../core/service/storage.service";
import {SnackbarService} from "../../../core/service/snackbar.service";

@Component({
  selector: 'app-complaints-create',
  templateUrl: './complaints-create.component.html',
  styleUrls: ['./complaints-create.component.css']
})
export class ComplaintsCreateComponent {

  private allSubscriptions: Subscription[] = [];
  orderDetails: OrderDetailsDTO;
  displayedColumns: string[] = ['itemId', 'title', 'description', 'price'];
  dataSource: MatTableDataSource<ItemWithImageDTO>;


  constructor(
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute) {
    this.allSubscriptions.push(
      this.route.queryParams.subscribe(() => {
          this.orderDetails = this.storageService.getOrderDetails();
          if (!this.orderDetails) {
            this.snackbarService.openSnackBar('Could not find order details for this order.')
            this.router.navigate(['/']);
          }
          this.dataSource = new MatTableDataSource(this.orderDetails.items);
      }));
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }


}
