import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
    ListarComponent,
    CadastrarComponent,
    AtualizarComponent
} from './components'

const routes: Routes = [
    { path: '', component: ListarComponent },
    { path: 'pesquisar', component: ListarComponent },
    { path: 'cadastrar', component: CadastrarComponent },
    { path: 'atualizar/:userId', component: AtualizarComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuarioRoutingModule {
}
