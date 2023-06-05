import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ItemSizeModel} from "../../../shared/models/data.models";
import {HttpService} from "../../../core/service/http/http.service";
import {Subscription, switchMap} from "rxjs";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {HttpErrorService} from "../../../core/service/http/http-error.service";
import {ItemDTO} from "../../../shared/models/dto.models";
import {ItemService} from "../../../core/service/item.service";

@Component({
    selector: 'app-item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
    item?: ItemDTO;
    itemSizes: ItemSizeModel[] = [];

    selectedItemSize: string = '';
    private allSubscriptions: Subscription[] = [];
    itemAmount: number = 1;

    constructor(private route: ActivatedRoute,
                private httpService: HttpService,
                private snackbarService: SnackbarService,
                private itemService: ItemService,
                private httpErrorService: HttpErrorService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                switchMap((queryParams: Params) => {
                    const itemId: string = queryParams['itemId'];
                    return this.httpService.getItemById(itemId);
                }))
                .subscribe(({
                    next: next => {
                        this.item = next.items[0];
                        if (!this.item) {
                            this.router.navigate(['/']).then((navigated: boolean) => {
                                if (navigated) {
                                    this.snackbarService.openSnackBar('Could not find item with this ID.');
                                }
                            });
                        }
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                        this.router.navigate(['/']);
                    }
                })));
        this.allSubscriptions.push(
            this.httpService.getAllItemSizes()
                .subscribe(itemResponse => {
                    itemResponse.itemSizes.forEach(itemSize => this.itemSizes.push(itemSize));
                    this.selectedItemSize = itemResponse.itemSizes[0].size;
                })
        );
    }

    clearInput() {
        this.itemAmount = 1
    }

    getImage() {
        if (this.item?.itemImages) {
            return this.item.itemImages[0].imageBase64;
        }
        return '';
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    addToCart(): void {
        this.itemService.addToCart(this.item, this.itemSizes, this.itemAmount, this.selectedItemSize);
    }
}
