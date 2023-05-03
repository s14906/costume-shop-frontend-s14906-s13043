import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ItemColorModel, ItemModel, ItemSizeModel} from "../../../shared/models/data.models";
import {HttpService} from "../../../core/service/http.service";
import {combineLatestWith, forkJoin, map, Subscription} from "rxjs";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  item?: ItemModel;
  itemSizes: ItemSizeModel[] = [];
  itemColors: ItemColorModel[] = [];

  selectedItemSize: string = '';
  selectedItemColor: string = '';
  private allSubscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private httpService: HttpService) {

  }

  ngOnInit(): void {
    this.allSubscriptions.push(
      this.route.queryParams.pipe(
      combineLatestWith(this.httpService.getAllItems()))
      .subscribe(([params, items]) => {
        this.item = items.find((item: ItemModel) => item.id.toString() === params['id']);
      }));
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

  clearInput(amountInput: HTMLInputElement) {
    amountInput.setRangeText('');
  }

  getImage() {
    if(this.item?.itemImages) {
      return this.item.itemImages[0].imageBase64;
    }
    return '';
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  printSelections() {
    console.log(this.selectedItemColor);
    console.log(this.selectedItemSize);
  }
}
