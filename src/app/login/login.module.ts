import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { LoginService } from './services'

import { MatSnackBarModule } from '@angular/material'

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        LoginRoutingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        LoginService,
    ]
})
export class LoginModule {}
