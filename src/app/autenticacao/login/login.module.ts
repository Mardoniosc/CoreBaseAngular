import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent, LogarComponent } from './components';
import { LoginRoutingModule } from './login-routing.module'
import { LoginService } from './services'

@NgModule({
  declarations: [
    LoginComponent,
    LogarComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
  ],
  providers: [
    LoginService,
  ]
})
export class LoginModule { }
