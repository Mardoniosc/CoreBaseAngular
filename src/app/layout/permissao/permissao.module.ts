import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageHeaderModule } from './../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'

import { SharedModule } from '../../shared'

import { OrderModule } from 'ngx-order-pipe'

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
  MatRadioModule,
  MatPaginatorModule,
  MatSortModule,
  MatCardModule,
  MatPaginatorIntl,
  MatCheckboxModule,
} from '@angular/material'

import {
    CadastrarComponent,
    ListarComponent,
    AtualizarComponent,
} from './components';
import { PermissaoRoutingModule } from './permissao-routing.module';

@NgModule({
    declarations: [
        CadastrarComponent,
        ListarComponent,
        AtualizarComponent,
    ],
    imports: [
        CommonModule,
        PermissaoRoutingModule,
        PageHeaderModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        MatListModule,
        MatTooltipModule,
        MatIconModule,
        MatSnackBarModule,
        MatRadioModule,
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
    ]
})
export class PermissaoModule { }
