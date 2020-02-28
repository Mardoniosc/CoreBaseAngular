import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpfPipe, PerfilstatusPipe } from './pipes';
import { MascaraDirective } from './directives';

// Serviços
import {
  PerfilService,
  PermissaoService,
  UsuariosService,
  PerfilPermissaoService
} from './services'

@NgModule({
  declarations: [
    CpfPipe,
    PerfilstatusPipe,
    MascaraDirective
  ],
  imports: [
    CommonModule,
  ],
  exports:[
   CpfPipe,
   PerfilstatusPipe,
   MascaraDirective,
  ],
  providers: [
    PerfilService,
    PermissaoService,
    UsuariosService,
    PerfilPermissaoService
  ]
})
export class SharedModule { }
