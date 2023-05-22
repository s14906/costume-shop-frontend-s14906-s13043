import {Component, OnDestroy} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../core/service/http.service";
import {HttpErrorService} from "../../../core/service/http-error.service";

@Component({
  selector: 'app-complaints-chat',
  templateUrl: './complaints-chat.component.html',
  styleUrls: ['./complaints-chat.component.css']
})
export class ComplaintsChatComponent implements OnDestroy {
  private allSubscriptions: Subscription[] = [];


  constructor(private route: ActivatedRoute,
              private httpService: HttpService,
              private httpErrorService: HttpErrorService) {
      this.allSubscriptions.push(
          this.route.queryParams.pipe(
              switchMap((queryParams) =>
                  this.httpService.getComplaint(queryParams['complaintId']))
          ).subscribe(({
              next: next => {
                  // this.complaint = next.complaint;
                  console.log(next);
                //do something with the complaint
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
