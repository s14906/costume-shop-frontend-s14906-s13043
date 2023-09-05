import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HeaderComponent} from './ui/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {FooterComponent} from './ui/footer/footer.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from './app-routing.module';
import {MatInputModule} from "@angular/material/input";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {HomeComponent} from './ui/home/home.component';
import {ItemDetailsComponent} from './ui/item/item-details/item-details.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from './ui/login/login.component';
import {MatCardModule} from "@angular/material/card";
import {RegistrationComponent} from './ui/registration/registration.component';
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./core/service/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarService} from "./core/service/snackbar.service";
import {MatMenuModule} from "@angular/material/menu";
import {StorageService} from "./core/service/storage.service";
import {authInterceptorProviders} from "./core/service/auth/auth.interceptor";
import {RegistrationSuccessComponent} from './ui/registration/registration-success/registration-success.component';
import {
    RegistrationVerificationComponent
} from './ui/registration/registration-verification/registration-verification.component';
import {CartComponent} from './ui/cart/cart.component';
import {CdkListbox, CdkOption} from "@angular/cdk/listbox";
import {HttpErrorService} from "./core/service/http/http-error.service";
import {AccountInformationComponent} from "./ui/account/account-information/account-information.component";
import {FormValidationService} from "./core/service/form/form-validation.service";
import {ComplaintsComponent} from './ui/complaints/complaints.component';
import { ComplaintsChatComponent } from './ui/complaints/complaints-chat/complaints-chat.component';
import { OrderComponent } from './ui/order/order/order.component';
import { OrderDetailsComponent } from './ui/order/order-details/order-details.component';
import { ComplaintsCreateComponent } from './ui/complaints/complaints-create/complaints-create.component';
import {MatTableModule} from "@angular/material/table";
import { ChatComponent } from './ui/complaints/chat/chat.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import { CartConfirmationComponent } from './ui/cart/cart-confirmation/cart-confirmation.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import { ItemListComponent } from './ui/item/item-list/item-list.component';
import { ItemEditComponent } from './ui/item/item-list/item-edit/item-edit.component';
import {ImageUploadService} from "./core/service/image/image-upload.service";
import { PaymentSuccessComponent } from './ui/payment/payment-success/payment-success.component';
import { ItemCategoryListComponent } from './ui/item/item-category-list/item-category-list.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        ItemDetailsComponent,
        LoginComponent,
        RegistrationComponent,
        RegistrationSuccessComponent,
        RegistrationVerificationComponent,
        CartComponent,
        AccountInformationComponent,
        ComplaintsComponent,
        ComplaintsChatComponent,
        OrderComponent,
        OrderDetailsComponent,
        ComplaintsCreateComponent,
        ChatComponent,
        CartConfirmationComponent,
        ItemListComponent,
        ItemEditComponent,
        PaymentSuccessComponent,
        ItemCategoryListComponent
    ],
    imports: [
        MatSortModule,
        BrowserModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        RouterLinkActive,
        MatTabsModule,
        MatButtonModule,
        RouterLink,
        AppRoutingModule,
        MatInputModule,
        MatGridListModule,
        MatSelectModule,
        FormsModule,
        MatCardModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatMenuModule,
        CdkOption,
        CdkListbox,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatRadioModule,
    ],
    providers: [
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {subscriptSizing: 'dynamic'},},
        AuthService,
        SnackbarService,
        MatSnackBar,
        StorageService,
        HttpErrorService,
        FormValidationService,
        ImageUploadService,
        authInterceptorProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
