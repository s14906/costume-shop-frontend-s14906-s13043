import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {HttpService} from "../../../core/service/http.service";
import {ItemDTO} from "../../../shared/models/dto.models";
import {ItemSizeModel} from "../../../shared/models/data.models";
import {Router} from "@angular/router";

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnDestroy {
    private allSubscriptions: Subscription[] = [];
    allItems: ItemDTO[] = [];
    allItemSizes: ItemSizeModel[] = [];

    constructor(private httpService: HttpService,
                private router: Router) {
        this.allSubscriptions.push(
            this.httpService.getAllItems()
                .subscribe({
                    next: next => {
                        this.allItems = next.itemsWithImages;
                        this.allItemSizes = next.itemSizes;
                    }
                })
        );
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
    }

    navigateToEditItem(item: ItemDTO) {
        console.log(item);
        this.router.navigate(['/']);
    }

    navigateToAddItem() {
        this.router.navigate(['/']);

    }
}
