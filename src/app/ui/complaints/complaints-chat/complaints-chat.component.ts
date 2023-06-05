import {Component, OnDestroy} from '@angular/core';
import {of, Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../../core/service/http/http.service";
import {HttpErrorService} from "../../../core/service/http/http-error.service";
import {ComplaintChatMessageDTO} from "../../../shared/models/dto.models";
import {formatDate, sortArrayByDateDesc} from 'src/app/shared/utils';
import {StorageService} from "../../../core/service/storage.service";
import {SnackbarService} from "../../../core/service/snackbar.service";

@Component({
    selector: 'app-complaints-chat',
    templateUrl: './complaints-chat.component.html',
    styleUrls: ['./complaints-chat.component.css']
})
export class ComplaintsChatComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    complaintId: string;
    complaintChatMessages: ComplaintChatMessageDTO[] = [];
    currentUser;
    currentUserEqualsBuyer: boolean;

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
                                        return this.httpService.getComplaintChatMessages(complaintResponse.complaints[0].complaintId);
                                    }
                                }
                            )
                        );
                    }
                )
            ).subscribe(({
                next: next => {
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
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    formatDate(createdDate: Date): string {
        return formatDate(createdDate);
    }

    isMessageAuthorEmployee(complaintChatMessage: ComplaintChatMessageDTO): boolean {
        const user = complaintChatMessage.user;
        return !!(user.roles && user.roles.includes('EMPLOYEE'));
    }
}
