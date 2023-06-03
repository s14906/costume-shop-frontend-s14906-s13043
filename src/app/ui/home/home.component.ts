import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from "../../core/service/http.service";
import {Subscription, switchMap} from "rxjs";
import {HttpErrorService} from "../../core/service/http-error.service";
import {ItemWithImageDTO} from "../../shared/models/dto.models";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home..component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    items: ItemWithImageDTO[] = [];
    allSubscriptions: Subscription[] = [];
    isSearch: boolean = false;

    constructor(private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParams: Params) => {
                    const searchText: string = queryParams['searchText'];
                    this.items = [];
                    if (searchText) {
                        this.isSearch = true;
                        return this.httpService.getAllItemsBySearchText(searchText);
                    } else {
                        this.isSearch = false;
                        return this.httpService.getAllItems();
                    }
                })).subscribe(
                {
                    next: next =>
                        next.itemsWithImages.forEach(item => this.items.push(item)),
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
