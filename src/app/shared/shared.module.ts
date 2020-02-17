import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';

import { CpfPipe } from './pipes';
import { MascaraDirective } from './directives';
import {
  ErrorComponent404,
  ErrorComponent500,
  DashboardComponent
} from './components';

@NgModule({
  declarations: [
    CpfPipe,
    MascaraDirective,
    ErrorComponent404,
    ErrorComponent500,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports:[
   CpfPipe,
   MascaraDirective,
  ]
})
export class SharedModule { }
