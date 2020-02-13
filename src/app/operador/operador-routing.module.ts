import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { DadosComponent, HomeComponent } from './components'

export const homeRoutes: Routes = [
  {
    path: 'operador',
    component: HomeComponent,
    children:[
      { path: '', component: DadosComponent }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class OperadorRoutingModule {
}
