import {Component, OnDestroy} from '@angular/core';
import {of, Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../../core/service/http/http.service";
import {HttpErrorService} from "../../../core/service/http/http-error.service";
import {ComplaintChatMessageDTO, UserDTO} from "../../../shared/models/dto.models";
import {formatDate, sortArrayByDateDesc} from 'src/app/shared/utils';
import {StorageService} from "../../../core/service/storage.service";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {ComplaintChatMessageResponse, ComplaintResponse} from "../../../shared/models/rest.models";
import {UserModel} from "../../../shared/models/data.models";

@Component({
    selector: 'app-complaints-chat',
    templateUrl: './complaints-chat.component.html',
    styleUrls: ['./complaints-chat.component.css']
})
export class ComplaintsChatComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    complaintId: string;
    complaintChatMessages: ComplaintChatMessageDTO[] = [];
    currentUser: UserModel;
    currentUserEqualsBuyer: boolean;
    complaintStatus: string;

    constructor(private route: ActivatedRoute,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private storageService: StorageService,
                private snackbarService: SnackbarService,
                private router: Router
    ) {
        this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParams) => {
                        this.complaintId = queryParams['complaintId'];
                        return this.httpService.getComplaint(this.complaintId).pipe(
                            switchMap((complaintResponse) => {
                                    if (!complaintResponse.complaints) {
                                        this.router.navigate(['/']).then((navigated: boolean) => {
                                            if (navigated) {
                                                this.snackbarService.openSnackBar('Could not complaint chat with this ID.');
                                            }
                                        });
                                        return of(null);
                                    } else {
                                        this.currentUserEqualsBuyer = this.currentUser.id === complaintResponse.complaints[0].buyerId;
                                        this.complaintStatus = complaintResponse.complaints[0].complaintStatus;
                                        return this.httpService.getComplaintChatMessages(complaintResponse.complaints[0].complaintId);
                                    }
                                }
                            )
                        );
                    }
                )
            ).subscribe(({
                next: (next: ComplaintChatMessageResponse | null): void => {
                    if (!this.currentUser
                        || (!this.currentUserEqualsBuyer && !this.currentUser.roles.includes('EMPLOYEE'))
                        || next === null) {
                        this.router.navigate(['/']);
                    } else {
                        this.complaintChatMessages = sortArrayByDateDesc(next.complaintChatMessages);
                    }
                },
                error: err => {
                    this.httpErrorService.handleError(err);
                }
            })));
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    formatDate(createdDate: Date): string {
        return formatDate(createdDate);
    }

    isMessageAuthorEmployee(complaintChatMessage: ComplaintChatMessageDTO): boolean {
        const user: UserDTO = complaintChatMessage.user;
        return !!(user.roles && user.roles.includes('EMPLOYEE'));
    }

    closeComplaint(): void {
        this.allSubscriptions.push(
            this.httpService.postCloseComplaint(this.complaintId)
                .subscribe({
                    next: (next: ComplaintResponse): void => {
                        this.complaintStatus = next.complaints[0].complaintStatus;
                        this.snackbarService.openSnackBar(next.message);
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })
        )
    }
}
