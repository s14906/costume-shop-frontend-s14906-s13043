import {Component, OnDestroy} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../core/service/http.service";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {ComplaintChatMessageDTO} from "../../../shared/models/dto.models";

@Component({
    selector: 'app-complaints-chat',
    templateUrl: './complaints-chat.component.html',
    styleUrls: ['./complaints-chat.component.css']
})
export class ComplaintsChatComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    complaintId: string;
    complaintChatMessages: ComplaintChatMessageDTO[] = [];

    constructor(private route: ActivatedRoute,
                private httpService: HttpService,
                private httpErrorService: HttpErrorService) {
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParams) => {
                    this.complaintId = queryParams['complaintId'];
                        return this.httpService.getComplaint(this.complaintId).pipe(
                            switchMap((complaint) =>
                                this.httpService.getComplaintChatMessages(complaint.complaintId)
                            )
                        );
                    }
                )
            ).subscribe(({
                next: next => {
                    this.complaintChatMessages = next;
                },
                error: err => {
                    this.httpErrorService.handleError(err);
                }
            })));
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
