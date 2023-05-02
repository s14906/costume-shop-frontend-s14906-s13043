import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './ui/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import { FooterComponent } from './ui/footer/footer.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import { AppRoutingModule } from './app-routing.module';
import {MatInputModule} from "@angular/material/input";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import { ProductListComponent } from './ui/product/product-list/product-list.component';
import { ProductDetailsComponent } from './ui/product/product-details/product-details.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './ui/login/login.component';
import {MatCardModule} from "@angular/material/card";
import { RegistrationComponent } from './ui/registration/registration.component';
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./core/service/auth.service";
import {HeaderRefreshService} from "./core/service/header-refresh.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProductListComponent,
    ProductDetailsComponent,
    LoginComponent,
    RegistrationComponent
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
    HttpClientModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic' }, },
    AuthService,
    HeaderRefreshService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
