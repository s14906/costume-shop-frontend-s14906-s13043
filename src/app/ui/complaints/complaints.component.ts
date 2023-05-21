import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../core/service/http.service";
import {UserModel} from "../../shared/models/data.models";
import {Subscription} from "rxjs";
import {TokenStorageService} from "../../core/service/token-storage.service";
import {SnackbarService} from "../../core/service/snackbar.service";
import {HttpErrorService} from "../../core/service/http-error.service";
import {Router} from "@angular/router";
import {ComplaintDTO} from "../../shared/models/dto.models";

@Component({
    selector: 'app-complaints',
    templateUrl: './complaints.component.html',
    styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnDestroy {
    complaints: ComplaintDTO[] = [];
    allSubscriptions: Subscription[] = [];

    loggedUser: UserModel;


    constructor(private httpService: HttpService,
                private tokenStorageService: TokenStorageService,
                private snackbarService: SnackbarService,
                private httpErrorService: HttpErrorService,
                private router: Router) {
        this.loggedUser = this.tokenStorageService.getUser();
        console.log(this.loggedUser);
        this.allSubscriptions.push(
            this.httpService.getAllComplaints().subscribe(complaints =>
                this.complaints = complaints)
        );
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

    showAssignButton
}
