import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProductDetailsComponent} from "./ui/product/product-details/product-details.component";
import {ProductListComponent} from "./ui/product/product-list/product-list.component";
import {LoginComponent} from "./ui/login/login.component";
import {RegistrationComponent} from "./ui/registration/registration.component";
import {RegistrationSuccessComponent} from "./ui/registration/registration-success/registration-success.component";
import {
  RegistrationVerificationComponent
} from "./ui/registration/registration-verification/registration-verification.component";
import {CartComponent} from "./ui/cart/cart.component";


const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product', component: ProductDetailsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'registration-success', component: RegistrationSuccessComponent},
  { path: 'registration-verification', component: RegistrationVerificationComponent},
  { path: 'cart', component: CartComponent}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
