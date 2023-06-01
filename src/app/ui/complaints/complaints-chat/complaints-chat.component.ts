import {Component, OnDestroy} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../../core/service/http.service";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {ComplaintChatMessageDTO} from "../../../shared/models/dto.models";
import {formatDate, sortArrayByDateDesc} from 'src/app/shared/utils';
import {StorageService} from "../../../core/service/storage.service";

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
                private router: Router
) {
      this.currentUser = this.storageService.getUser();
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParams) => {
                        this.complaintId = queryParams['complaintId'];
                        return this.httpService.getComplaint(this.complaintId).pipe(
                            switchMap((complaintResponse) => {
                              this.currentUserEqualsBuyer = this.currentUser.id === complaintResponse.complaints[0].buyerId;
                                return this.httpService.getComplaintChatMessages(complaintResponse.complaints[0].complaintId);
                            }
                            )
                        );
                    }
                )
            ).subscribe(({
                next: next => {
                  if (!this.currentUserEqualsBuyer) {
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
