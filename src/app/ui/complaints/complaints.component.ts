import {Component, OnDestroy, ViewChild} from '@angular/core';
import {HttpService} from "../../core/service/http.service";
import {UserModel} from "../../shared/models/data.models";
import {Subscription} from "rxjs";
import {StorageService} from "../../core/service/storage.service";
import {SnackbarService} from "../../core/service/snackbar.service";
import {HttpErrorService} from "../../core/service/http-error.service";
import {Router} from "@angular/router";
import {ComplaintDTO} from "../../shared/models/dto.models";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {formatDate} from "../../shared/utils";

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnDestroy {
  complaints: ComplaintDTO[] = [];
  allSubscriptions: Subscription[] = [];
  loggedUser: UserModel;
  displayedColumns: string[] = ['complaintId', 'userName', 'status', 'employee', 'createdDate', 'actions'];
  dataSource = new MatTableDataSource<ComplaintDTO>(this.complaints);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private httpService: HttpService,
              private storageService: StorageService,
              private snackbarService: SnackbarService,
              private httpErrorService: HttpErrorService,
              private router: Router) {
    this.loggedUser = this.storageService.getUser();
    this.allSubscriptions.push(
      this.httpService.getAllComplaints().subscribe({
        next: next => {
          this.complaints = next;
          this.dataSource.data = this.complaints;
          this.dataSource.sort = this.sort;
        },
        error: err => {
          this.httpErrorService.handleError(err);
        }
      })
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'userName': return item.buyerName + ' ' + item.buyerSurname;
        case 'employee': return item.employeeName && item.employeeSurname ? item.employeeName + ' ' + item.employeeSurname : 'NONE';
        case 'status'  : return item.complaintStatus ? item.complaintStatus: 'NONE';
        default: return item[property];
      }
    };
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  assignToEmployee(complaint: ComplaintDTO) {
    this.allSubscriptions.push(
      this.httpService.postAssignComplaintToEmployee(this.loggedUser.id, complaint.complaintId)
        .subscribe({
          next: next => {
            this.snackbarService.openSnackBar(next.message);
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['complaints']);
            });
          },
          error: err => {
            this.httpErrorService.handleError(err);
          }
        })
    );
  }

  navigateToSelectedComplaint(complaintId: string) {
    this.storageService.saveComplaintIdForUser(complaintId);
    this.router.navigate(['/complaints/chat'], {
      queryParams: {
        complaintId: complaintId
      }
    });
  }

  protected readonly formatDate = formatDate;
}
