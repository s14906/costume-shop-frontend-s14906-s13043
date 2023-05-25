import {NgModule} from '@angular/core';
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
import {AccountInformationComponent} from "./ui/account/account-information/account-information.component";
import {ComplaintsComponent} from "./ui/complaints/complaints.component";
import {ComplaintsChatComponent} from "./ui/complaints/complaints-chat/complaints-chat.component";
import {OrderHistoryComponent} from "./ui/order/order-history/order-history.component";
import {OrderDetailsComponent} from "./ui/order/order-details/order-details.component";


const routes: Routes = [
    {path: '', component: ProductListComponent},
    {path: 'product', component: ProductDetailsComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: 'registration-success', component: RegistrationSuccessComponent},
    {path: 'registration-verification', component: RegistrationVerificationComponent},
    {path: 'cart', component: CartComponent},
    {path: 'account', component: AccountInformationComponent},
    {path: 'complaints', component: ComplaintsComponent},
    {path: 'complaints/chat', component: ComplaintsChatComponent},
    {path: 'orders', component: OrderHistoryComponent},
    {path: 'orders/details', component: OrderDetailsComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
