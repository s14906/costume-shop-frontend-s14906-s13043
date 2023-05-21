import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from "../../../core/service/http.service";
import {Subscription} from "rxjs";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {ItemWithImageDTO} from "../../../shared/models/dto.models";

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
    items: ItemWithImageDTO[] = [];
    allSubscriptions: Subscription[] = [];

    constructor(private httpService: HttpService,
                private httpErrorService: HttpErrorService) {
    }

    ngOnInit(): void {
        this.allSubscriptions.push(this.httpService.getAllItems()
            .subscribe({
                next: items =>
                    items.forEach(item => this.items.push(item)),
                error: err => {
                    this.httpErrorService.handleError(err);
                }
            }));
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
