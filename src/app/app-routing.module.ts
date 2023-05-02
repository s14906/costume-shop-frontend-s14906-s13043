import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProductDetailsComponent} from "./ui/product/product-details/product-details.component";
import {ProductListComponent} from "./ui/product/product-list/product-list.component";
import {LoginComponent} from "./ui/login/login.component";
import {RegistrationComponent} from "./ui/registration/registration.component";


const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product', component: ProductDetailsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegistrationComponent}


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
