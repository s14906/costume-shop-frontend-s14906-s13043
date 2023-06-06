import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from "../../core/service/http/http.service";
import {Observable, Subscription, switchMap} from "rxjs";
import {HttpErrorService} from "../../core/service/http/http-error.service";
import {ItemDTO} from "../../shared/models/dto.models";
import {ActivatedRoute, Params} from "@angular/router";
import {ItemResponse} from "../../shared/models/rest.models";

@Component({
    selector: 'app-home',
    templateUrl: './home..component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    items: ItemDTO[] = [];
    allSubscriptions: Subscription[] = [];
    isSearch: boolean = false;
    loading: boolean = true;

    constructor(private httpService: HttpService,
                private httpErrorService: HttpErrorService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParams: Params): Observable<ItemResponse> => {
                    const searchText: string = queryParams['searchText'];
                    const category: string = queryParams['category'];
                    this.items = [];
                    if (searchText && category) {
                        this.isSearch = true;
                        return this.httpService.getAllItemsBySearchTextAndCategory(searchText, category)
                    } else if (category) {
                        this.isSearch = true;
                        return this.httpService.getAllItemsBySearchTextAndCategory('all', category);
                    } else if (searchText) {
                        this.isSearch = true;
                        return this.httpService.getAllItemsBySearchTextAndCategory(searchText, 'all');
                    } else {
                        this.isSearch = false;
                        return this.httpService.getAllItems();
                    }
                })).subscribe(
                {
                    next: (next: ItemResponse) => {
                        next.items.forEach((item: ItemDTO): void => {
                            if (item.visible && item.quantity > 0) {
                                this.items.push(item)
                            }
                        })
                        this.loading = false;
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                        this.loading = false;
                    }
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }
}
