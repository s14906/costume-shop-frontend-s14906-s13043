import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpService} from "../../core/service/http/http.service";
import {Subscription} from "rxjs";
import {StorageService} from "../../core/service/storage.service";
import {SnackbarService} from "../../core/service/snackbar.service";
import {HttpErrorService} from "../../core/service/http/http-error.service";
import {Router} from "@angular/router";
import {ComplaintDTO} from "../../shared/models/dto.models";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {formatDate} from "../../shared/utils";
import {ComplaintResponse, SimpleResponse} from "../../shared/models/rest.models";
import {UserModel} from "../../shared/models/data.models";

@Component({
    selector: 'app-complaints',
    templateUrl: './complaints.component.html',
    styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnDestroy, OnInit {
    complaints: ComplaintDTO[] = [];
    allSubscriptions: Subscription[] = [];
    currentUser: UserModel;
    displayedColumns: string[] = ['complaintId', 'userName', 'status', 'employee', 'createdDate', 'actions'];
    dataSource = new MatTableDataSource<ComplaintDTO>(this.complaints);
    loading: boolean = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private snackbarService: SnackbarService,
                private httpErrorService: HttpErrorService,
                private router: Router) {
        this.currentUser = this.storageService.getUser();
        if (!this.currentUser.roles.includes('EMPLOYEE')) {
            this.router.navigate(['/']);
        }

        this.allSubscriptions.push(
            this.httpService.getAllComplaints().subscribe({
                next: (next: ComplaintResponse): void => {
                    this.complaints = next.complaints;
                    this.dataSource.data = this.complaints;
                    this.dataSource.sort = this.sort;
                    this.loading = false;
                },
                error: err => {
                    this.httpErrorService.handleError(err);
                    this.loading = false;
                }
            })
        );
    }

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item: ComplaintDTO, property: string): string => {
            switch (property) {
                case 'userName':
                    return item.buyerName + ' ' + item.buyerSurname;
                case 'employee':
                    return item.employeeName && item.employeeSurname ? item.employeeName + ' ' + item.employeeSurname : 'NONE';
                case 'status'  :
                    return item.complaintStatus ? item.complaintStatus : 'NONE';
                default:
                    return item[property];
            }
        };
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    assignToEmployee(complaint: ComplaintDTO): void {
        this.loading = true;
        this.allSubscriptions.push(
            this.httpService.postAssignComplaintToEmployee(this.currentUser.id, complaint.complaintId)
                .subscribe({
                    next: (next: SimpleResponse): void => {
                        this.snackbarService.openSnackBar(next.message);
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                            this.router.navigate(['complaints']);

                        });
                        this.loading = false;
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                        this.loading = false;
                    }
                })
        );
    }

    navigateToSelectedComplaint(complaintId: string): void {
        const orderId: number | undefined = this.complaints.find((complaint: ComplaintDTO): boolean =>
            complaint.complaintId === Number(complaintId))?.orderId;
        if (orderId) {
            this.router.navigate(['/complaints/chat'], {
                queryParams: {
                    complaintId: complaintId,
                    orderId: orderId
                }
            });
        }

    }

    protected readonly formatDate = formatDate;
}
