import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ItemModel} from "../../../shared/models/data.models";
import {HttpService} from "../../../core/service/http.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  // @Output() productEventEmitter = new EventEmitter<ItemModel>();
  items: ItemModel[] = [];
  allSubscriptions: Subscription[] = [];


  constructor(private httpService: HttpService) {

  }

  ngOnInit(): void {
   this.allSubscriptions.push(this.httpService.getAllItems()
      .subscribe(items => items.forEach(item => this.items.push(item))));
  }

  clickProduct(product: ItemModel) {
    // this.productEventEmitter.emit(product)
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
