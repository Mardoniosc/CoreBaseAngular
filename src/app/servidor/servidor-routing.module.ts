import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ServidorComponent } from './components'
import { DashboardComponent } from '../shared'

export const servidorRoutes: Routes = [
  {
    path: 'servidor',
    component: ServidorComponent,
    children:[
      { path: '', component: DashboardComponent }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(servidorRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ServidorRoutingModule {
}
