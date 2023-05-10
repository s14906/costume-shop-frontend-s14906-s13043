import {Component, OnDestroy} from '@angular/core';
import {mergeMap, Subscription, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../core/service/http.service";

@Component({
    selector: 'app-registration-verification',
    templateUrl: './registration-verification.component.html',
    styleUrls: ['./registration-verification.component.css']
})
export class RegistrationVerificationComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];

    userVerified: boolean = false;

    constructor(private route: ActivatedRoute,
                private httpService: HttpService) {
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap(params =>
                    this.httpService.getUserByVerificationToken(params['token'])),
                mergeMap((response) =>
                    this.httpService.postUserVerification(response.user.id)))
                .subscribe((response) =>
                    this.userVerified = response.success
                ));
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
