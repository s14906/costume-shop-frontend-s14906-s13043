import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {products} from "../../../shared/data/products";
import {ProductModel} from "../../../shared/models/data.models";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @Output() productEventEmitter = new EventEmitter<ProductModel>();
  products: ProductModel[] = products;

  constructor() {

  }

  ngOnInit(): void {

  }

  clickProduct(product: ProductModel) {
    this.productEventEmitter.emit(product)
  }
}
