import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {
  AtualizacaoComponent,
  ListagemComponent,
  CadastroComponent,
  AdministradorComponent
} from './components'

import { DashboardComponent } from '../shared'

export const routes: Routes = [
  {
    path: 'admin',
    component: AdministradorComponent,
    children:[
      { path: '', component: DashboardComponent },
      { path: 'cadastro', component: CadastroComponent },
      { path: 'listagem', component: ListagemComponent },
      { path: 'atualizacao/:userId', component: AtualizacaoComponent }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdministradorRoutingModule {
}
