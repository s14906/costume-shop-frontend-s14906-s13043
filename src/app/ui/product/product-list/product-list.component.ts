import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemModel} from "../../../shared/models/data.models";
import {HttpService} from "../../../core/service/http.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  items: ItemModel[] = [];
  allSubscriptions: Subscription[] = [];

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
   this.allSubscriptions.push(this.httpService.getAllItems()
      .subscribe(items => items.forEach(item => this.items.push(item))));
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
