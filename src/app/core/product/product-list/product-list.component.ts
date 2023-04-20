import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Product} from "../../model/product";
import {Router} from '@angular/router';
import {products} from "../../data/products";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @Output() productEventEmitter = new EventEmitter<Product>();
  products: Product[] = products;

  constructor(private router: Router) {

  }

  ngOnInit(): void {

  }


  clickProduct(product: Product) {
    this.productEventEmitter.emit(product)
  }
}
