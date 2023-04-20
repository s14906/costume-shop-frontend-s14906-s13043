import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProductDetailsComponent} from "./core/product/product-details/product-details.component";
import {ProductListComponent} from "./core/product/product-list/product-list.component";


const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product', component: ProductDetailsComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
