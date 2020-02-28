import { Component, OnInit, OnDestroy, Inject } from '@angular/core'
import { Subscription } from 'rxjs'
import { PerfilHasPermissao, PerfilPermissaoService } from 'src/app/shared'
import { Router } from '@angular/router';

import {
    MatSnackBar,
} from '@angular/material'

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = []

    perfilPermissao = {} as PerfilHasPermissao
    perfilpermissaoFiltrados: PerfilHasPermissao[]

    perfilPermissoes: PerfilHasPermissao[]
    perfilHasPermissao = {} as PerfilHasPermissao


    totalDePermissoes = 1
    advancedPagination: number;

    constructor(
        private perfilPermissaoService: PerfilPermissaoService,
        public router: Router,
        private snackBar: MatSnackBar,

    ) {
        this.advancedPagination = 1;

     }

    ngOnInit() {
        this.listarTodosPermissoes()
    }

    key: string = 'permissao'; // Define um valor padrão, para quando inicializar o componente
    reverse: boolean = false;
    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    ngOnDestroy(){
        localStorage.removeItem('permissaoList')
        localStorage.removeItem('allPermissoes')
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }

    pesquisa(termoPesquisa: string) {
        if(!termoPesquisa) {
            this.perfilpermissaoFiltrados = JSON.parse(localStorage.getItem('allPermissoes'));
          } else {
            this.perfilpermissaoFiltrados = this.perfilPermissoes.filter(x =>
               x['permissao_id'].descricao.trim().toLowerCase().includes(termoPesquisa.trim().toLowerCase())
            );

        }
        this.totalDePermissoes = this.perfilpermissaoFiltrados.length
    }

    listarTodosPermissoes(){
        this.subscriptions.push(
            this.perfilPermissaoService.getAllPerfilPermissao()
                .subscribe(
                    data => {
                        this.perfilPermissoes = data
                        this.totalDePermissoes = this.perfilPermissoes.length
                        localStorage.setItem('allPermissoes', JSON.stringify(this.perfilPermissoes))
                        this.pesquisa('')
                    },
                    err => {
                        if(err.status === 401){
                            let msg = "seu permissao não é autorizado a listar permissoes"
                            this.snackBar.open(msg, "Sem privilérios", { duration: 5000 })
                        }else{
                            let msg = "Erro ao obter listar de usuários"
                            this.snackBar.open(msg, "Erro", { duration: 5000 })
                        }
                    }
                )

        )
    }

    perfilHasPermissaoButton(id){
        this.subscriptions.push(
            this.perfilPermissaoService.getPerfilPermissaoId(id)
                .subscribe(
                    data => {
                        this.perfilHasPermissao = data
                        this.mudarPermissao(this.perfilHasPermissao)
                    },
                    err => {
                        if(err.status === 401){
                            let msg = "seu perfil não é autorizado a alterar esta permissão"
                            this.snackBar.open(msg, "Sem privilérios", { duration: 5000 })
                        }else{
                            let msg = "Erro ao obter permissao selecionada"
                            this.snackBar.open(msg, "Erro", { duration: 5000 })
                        }
                    },
                )
        )
    }

    mudarPermissao(permissao: PerfilHasPermissao){
        if(permissao.status === 1){
            permissao.status = 0
        }else{
            permissao.status = 1
        }
        this.subscriptions.push(
            this.perfilPermissaoService.updatePerfilPermissao(permissao, permissao.id)
                .subscribe(
                    data => {
                        this.listarTodosPermissoes()
                        let msg = "Permissão atualizada com sucesso"
                        this.snackBar.open(msg, "Sucesso", { duration: 4000 })
                    },
                    err => {
                        if(err.status === 401){
                            let msg = "seu perfil não é autorizado a alterar esta permissão"
                            this.snackBar.open(msg, "Sem privilérios", { duration: 5000 })
                        }else{
                            let msg = "Erro ao obter permissao selecionada"
                            this.snackBar.open(msg, "Erro", { duration: 5000 })
                        }
                    },
                )
        )

    }

}
