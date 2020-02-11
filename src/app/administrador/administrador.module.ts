import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import {
  ListagemComponent,
  AtualizacaoComponent,
  CadastroComponent,
  AdministradorComponent,
  ConfirmarDialog
} from './components'

import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'

import {
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatTooltipModule,
  MatIconModule,
  MatSnackBarModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatCardModule,
  MatPaginatorIntl,
} from '@angular/material'

import { UsuariosService } from 'src/app/shared/services'
import { SharedModule } from 'src/app/shared/shared.module'



@NgModule({
  declarations: [
    ListagemComponent,
    CadastroComponent,
    AtualizacaoComponent,
    AdministradorComponent,
    ConfirmarDialog
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
  ],
  providers: [
    UsuariosService,
    MatPaginatorIntl,
  ],
  entryComponents: [ ConfirmarDialog ]
})
export class AdministradorModule { }
