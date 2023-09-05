import {Component, OnDestroy} from '@angular/core';
import {combineLatest, Subscription} from "rxjs";
import {AuthService} from "../../core/service/auth/auth.service";
import {SnackbarService} from "../../core/service/snackbar.service";
import {StorageService} from "../../core/service/storage.service";
import {Router} from "@angular/router";
import {HttpService} from "../../core/service/http/http.service";
import {ItemCategoryDTO} from "../../shared/models/dto.models";
import {ItemResponse} from "../../shared/models/rest.models";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements OnDestroy {
    loggedIn: boolean = false;
    userRoles?: string[];
    private allSubscriptions: Subscription[] = [];
    searchText: string;
    itemCategories: string[] = [];
    selectedCategory: string;

    constructor(public authService: AuthService,
                private snackbarService: SnackbarService,
                private storageService: StorageService,
                private httpService: HttpService,
                private router: Router
    ) {
        this.allSubscriptions.push(
            combineLatest([this.authService.getIsLoggedIn(), this.storageService.getUserRoles()])
                .subscribe(userData => {
                    this.loggedIn = userData[0];
                    this.userRoles = userData[1];
                }));
        this.allSubscriptions.push(
            this.httpService.getAllItemCategories()
                .subscribe({
                    next: (next: ItemResponse): void => {
                        this.itemCategories = next.itemCategories
                            .map((itemCategory: ItemCategoryDTO) => itemCategory.category);
                    }
                })
        );
    }

    logout(): void {
        this.storageService.signOut();
        this.authService.announceLogout();
        this.snackbarService.openSnackBar('Logged out!');
        this.router.navigate(['/']);
    }

    ngOnDestroy(): void {
        this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    navigateToCart(): void {
        this.selectedCategory = 'all';
        this.router.navigate(['/cart']);
    }

    navigateToAccountInformation(): void {
        this.selectedCategory = 'all';
        this.router.navigate(['/account']);
    }

    navigateToComplaints(): void {
        this.selectedCategory = 'all';
        this.router.navigate(['complaints']);
    }

    navigateToOrderHistory(): void {
        this.selectedCategory = 'all';
        this.router.navigate(['orders']);
    }

    navigateToAllOrders(): void {
        this.selectedCategory = 'all';
        this.router.navigate(['orders/all']);
    }

    navigateToItemCategories(): void {
      this.selectedCategory = 'all';
      this.router.navigate(['item-categories']);
    }

    checkEnterKeyPressed($event): void {
        if ($event.key === 'Enter') {
            this.navigateToSearch();
        }
    }

    navigateToSearch(): void {
        this.router.navigate(['/search'], {
            queryParams: {
                category: this.selectedCategory ? this.selectedCategory : 'all',
                searchText: this.searchText ? this.searchText : 'all'
            }
        });
    }

    navigateToHome(): void {
        this.searchText = '';
        if (this.router.url !== '/') {
            this.selectedCategory = 'all';
            this.router.navigate(['/']);
        } else {
            window.location.reload();
        }
    }

    navigateToItemList(): void {
        this.router.navigate(['items']);
    }

    selectCategory(itemCategory: string): void {
        this.selectedCategory = itemCategory;
    }
}
