import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ItemColorModel,  ItemSizeModel} from "../../../shared/models/data.models";
import {HttpService} from "../../../core/service/http.service";
import {combineLatestWith, Subscription} from "rxjs";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {TokenStorageService} from "../../../core/service/token-storage.service";
import {HttpErrorService} from "../../../core/service/http-error.service";
import {ItemWithImageDTO} from "../../../shared/models/dto.models";

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    item?: ItemWithImageDTO;
    itemSizes: ItemSizeModel[] = [];
    itemColors: ItemColorModel[] = [];

    selectedItemSize: string = '';
    selectedItemColor: string = '';
    private allSubscriptions: Subscription[] = [];
    itemAmount: number = 1;

    constructor(private route: ActivatedRoute,
                private httpService: HttpService,
                private snackbarService: SnackbarService,
                private tokenStorageService: TokenStorageService,
                private httpErrorService: HttpErrorService) {
    }

    ngOnInit(): void {
        this.allSubscriptions.push(
            this.route.queryParams.pipe(
                combineLatestWith(this.httpService.getAllItems()))
                .subscribe(({
                    next: next => {
                        const params = next[0];
                        const items = next[1];
                        this.item = items.find((item: ItemWithImageDTO) => item.itemId.toString() === params['id'])
                    },
                    error: err => {
                        this.httpErrorService.handleError(err);
                    }
                })));
        this.allSubscriptions.push(
            this.httpService.getAllItemSizes()
                .subscribe(itemSizes => {
                    itemSizes.forEach(itemSize => this.itemSizes.push(itemSize));
                    this.selectedItemSize = itemSizes[0].size;
                })
        );
        this.allSubscriptions.push(
            this.httpService.getAllItemColors()
                .subscribe(itemColors => {
                    itemColors.forEach(itemColor => this.itemColors.push(itemColor));
                    this.selectedItemColor = itemColors[0].color;
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

    addToCart() {
        this.httpService.postAddToCart({
            userId: this.tokenStorageService.getUser().id,
            itemId: this.item?.itemId,
            itemSizeId: this.itemSizes.find(itemSize => itemSize.size === this.selectedItemSize)?.id,
            itemAmount: this.itemAmount
        }).subscribe({
            next: next => {
                this.snackbarService.openSnackBar(next.message);
            },
            error: err => {
                this.snackbarService.openSnackBar(err.error.message);
            }
        });
    }
}
