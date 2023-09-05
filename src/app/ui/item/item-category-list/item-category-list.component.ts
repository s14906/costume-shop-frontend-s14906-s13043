import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../../core/service/http/http.service";
import {Subscription} from "rxjs";
import {ItemCategoryDTO} from "../../../shared/models/dto.models";
import {ItemResponse} from "../../../shared/models/rest.models";

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category-list.component.html',
  styleUrls: ['./item-category-list.component.css']
})
export class ItemCategoryListComponent implements OnDestroy {
  private allSubscriptions: Subscription[] = [];
  loading: boolean = false;
  itemCategories: ItemCategoryDTO[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;

  constructor(private httpService: HttpService) {

    this.allSubscriptions.push(
      this.httpService.getAllItemCategories().subscribe((next: ItemResponse): void => {
        this.itemCategories = next.itemCategories;
      })
    );
  }

  get paginatedOrders() {
    const begin: number = this.currentPage * this.itemsPerPage;
    const end: number = begin + this.itemsPerPage;
    return this.itemCategories.slice(begin, end);
  }

  addNewCategory(): void {

  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
