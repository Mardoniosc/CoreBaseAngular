import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppComponent } from './app.component';

import { LoginModule, LoginRoutingModule} from './autenticacao'
import { AdministradorModule, AdministradorRoutingModule } from './administrador'

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { TokenInterceptor } from './shared';
import { SharedModule } from './shared/shared.module'

import {
  MatToolbarModule,
  MatIconModule
} from '@angular/material'

import { FlexLayoutModule } from '@angular/flex-layout'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoginModule,
    LoginRoutingModule,
    AdministradorModule,
    AdministradorRoutingModule,
    SharedModule,
    MatToolbarModule,
    MatIconModule,
    FlexLayoutModule,

    AppRoutingModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
