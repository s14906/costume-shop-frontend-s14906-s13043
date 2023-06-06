import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {HttpService} from "../../../core/service/http/http.service";
import {ItemDTO} from "../../../shared/models/dto.models";
import {ItemSizeModel, UserModel} from "../../../shared/models/data.models";
import {Router} from "@angular/router";
import {StorageService} from "../../../core/service/storage.service";
import {ItemResponse} from "../../../shared/models/rest.models";

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    allItems: ItemDTO[] = [];
    allItemSizes: ItemSizeModel[] = [];
    currentUser: UserModel;
    loading: boolean = true;

    constructor(private httpService: HttpService,
                private storageService: StorageService,
                private router: Router) {
        this.currentUser = this.storageService.getUser();
        if (!this.currentUser || !this.currentUser.roles.includes('EMPLOYEE')) {
            this.router.navigate(['/']);
        }

        this.allSubscriptions.push(
            this.httpService.getAllItems()
                .subscribe({
                    next: (next: ItemResponse): void => {
                        this.allItems = next.items;
                        this.allItemSizes = next.itemSizes;
                        this.loading = false;
                    }
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    navigateToEditItem(item: ItemDTO): void {
        console.log(item);
        this.router.navigate(['/items/edit'], {
            queryParams: {
                itemId: item.itemId
            }
        });
    }

    navigateToAddItem(): void {
        this.router.navigate(['/items/add']);

    }
}
