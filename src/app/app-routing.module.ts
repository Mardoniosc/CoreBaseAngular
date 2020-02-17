import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ErrorComponent404 } from './shared'

export const routes: Routes = [
  {
    path: '', redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    // todo path que ele não encontrar vai dar erro 404
    path: '**', component: ErrorComponent404,

  }
]
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],

exports: [ RouterModule ] })

export class AppRoutingModule {
}
