import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServidorComponent } from './components'
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ServidorComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ServidorModule { }
