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
import {ProductListComponent} from './ui/product/product-list/product-list.component';
import {ProductDetailsComponent} from './ui/product/product-details/product-details.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from './ui/login/login.component';
import {MatCardModule} from "@angular/material/card";
import {RegistrationComponent} from './ui/registration/registration.component';
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./core/service/auth.service";
import {MessageService} from "./core/service/message.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarService} from "./core/service/snackbar.service";
import {MatMenuModule} from "@angular/material/menu";
import {StorageService} from "./core/service/storage.service";
import {authInterceptorProviders} from "./core/service/auth.interceptor";
import {RegistrationSuccessComponent} from './ui/registration/registration-success/registration-success.component';
import {
    RegistrationVerificationComponent
} from './ui/registration/registration-verification/registration-verification.component';
import {CartComponent} from './ui/cart/cart.component';
import {CdkListbox, CdkOption} from "@angular/cdk/listbox";
import {HttpErrorService} from "./core/service/http-error.service";
import {AccountInformationComponent} from "./ui/account/account-information/account-information.component";
import {FormValidationService} from "./core/service/form-validation.service";
import {ComplaintsComponent} from './ui/complaints/complaints.component';
import { ComplaintsChatComponent } from './ui/complaints/complaints-chat/complaints-chat.component';
import { OrderHistoryComponent } from './ui/order/order-history/order-history.component';
import { OrderDetailsComponent } from './ui/order/order-details/order-details.component';
import { ComplaintsCreateComponent } from './ui/complaints/complaints-create/complaints-create.component';
import {SubjectService} from "./core/service/subject.service";
import {MatTableModule} from "@angular/material/table";
import { ChatComponent } from './ui/complaints/chat/chat.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        ProductListComponent,
        ProductDetailsComponent,
        LoginComponent,
        RegistrationComponent,
        RegistrationSuccessComponent,
        RegistrationVerificationComponent,
        CartComponent,
        AccountInformationComponent,
        ComplaintsComponent,
        ComplaintsChatComponent,
        OrderHistoryComponent,
        OrderDetailsComponent,
        ComplaintsCreateComponent,
        ChatComponent
    ],
    imports: [
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
    ],
    providers: [
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {subscriptSizing: 'dynamic'},},
        AuthService,
        MessageService,
        SnackbarService,
        MatSnackBar,
        StorageService,
        HttpErrorService,
        FormValidationService,
        SubjectService,
        authInterceptorProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
