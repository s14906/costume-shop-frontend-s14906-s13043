import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ItemDetailsComponent} from "./ui/item/item-details/item-details.component";
import {ItemListComponent} from "./ui/item/item-list/item-list.component";
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
import {OrderComponent} from "./ui/order/order/order.component";
import {OrderDetailsComponent} from "./ui/order/order-details/order-details.component";
import {ComplaintsCreateComponent} from "./ui/complaints/complaints-create/complaints-create.component";
import {CartConfirmationComponent} from "./ui/cart/cart-confirmation/cart-confirmation.component";


const routes: Routes = [
    {path: '', component: ItemListComponent},
    {path: 'item', component: ItemDetailsComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: 'registration-success', component: RegistrationSuccessComponent},
    {path: 'registration-verification', component: RegistrationVerificationComponent},
    {path: 'cart', component: CartComponent},
    {path: 'cart/confirmation', component: CartConfirmationComponent},
    {path: 'account', component: AccountInformationComponent},
    {path: 'complaints', component: ComplaintsComponent},
    {path: 'complaints/chat', component: ComplaintsChatComponent},
    {path: 'orders', component: OrderComponent},
    {path: 'orders/all', component: OrderComponent},
    {path: 'orders/details', component: OrderDetailsComponent},
    {path: 'orders/complaint', component: ComplaintsCreateComponent},


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
