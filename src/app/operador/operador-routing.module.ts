import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import {  HomeComponent } from './components'
import { DashboardComponent } from '../shared'

export const homeRoutes: Routes = [
  {
    path: 'operador',
    component: HomeComponent,
    children:[
      { path: '', component: DashboardComponent }
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
