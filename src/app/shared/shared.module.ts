import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpfPipe } from './pipes';
import { MascaraDirective } from './directives';

@NgModule({
  declarations: [
    CpfPipe,
    MascaraDirective,
  ],
  imports: [
    CommonModule
  ],
  exports:[
   CpfPipe,
   MascaraDirective,
  ]
})
export class SharedModule { }
