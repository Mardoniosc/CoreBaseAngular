import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageHeaderModule } from './../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'

import { SharedModule } from '../../shared'

import {
  MatInputModule,
  MatSelectModule,
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

import { OrderModule } from 'ngx-order-pipe'

import { PerfilRoutingModule } from './perfil-routing.module'
import {
    ListarComponent,
    CadastrarComponent,
    AtualizarComponent,
    ConfirmarDialog
} from './components';

@NgModule({
  declarations: [
      ListarComponent,
      CadastrarComponent,
      AtualizarComponent,
      ConfirmarDialog
    ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    PageHeaderModule,
    MatInputModule,
    MatSelectModule,
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
    NgbModule,
    OrderModule,
    SharedModule,
  ],
  providers: [
      MatPaginatorIntl
  ],
  entryComponents: [ ConfirmarDialog ]
})
export class PerfilModule { }
