import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/product";
import {ActivatedRoute} from "@angular/router";
import {products} from "../../data/products";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  sizes: string[] = ['XL', 'L', 'M', 'S'];

  constructor(private route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
          console.log(params); // { orderby: "price" }
          this.product = products.find(prod => prod.id.toString() === params['id']);
        }
      );
  }

  ngOnInit(): void {
    console.log(this.product);
    }

}
