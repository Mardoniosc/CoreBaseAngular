import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DadosComponent, HomeComponent } from './components'


@NgModule({
  declarations: [
    HomeComponent,
    DadosComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class OperadorModule { }
