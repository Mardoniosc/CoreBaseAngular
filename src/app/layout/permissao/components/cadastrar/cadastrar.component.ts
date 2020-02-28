import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {
  PermissaoService,
  Permissao,
  PerfilHasPermissao,
  PerfilPermissaoService,
  Perfil,
  PerfilService,
} from 'src/app/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = []

    perfilPermissoes: PerfilHasPermissao[]
    perfilHasPermissao = {} as PerfilHasPermissao

    perfils: Perfil[]
    perfil = {} as Perfil

    idPerfilSelecionado = null

    perfilSelecionadoTrue = false

    permissao = {} as Permissao
    permissoes: Permissao[]

    checkBoxSelecionadosArray = [] as Array<Int32Array>


    constructor(
        private snackBar: MatSnackBar,
        private router: Router,
        private perfilPermissaoService: PerfilPermissaoService,
        private perfilService: PerfilService,
        private permissaoService: PermissaoService,
    ) { }

    ngOnInit() {
        this.listarTodosPerfils()
        this.listarTodasPermissoes()
        this.listarTodasPerfilHasPermissao()

    }

    ngOnDestroy(){
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
        localStorage.removeItem('allPerfils')
        localStorage.removeItem('allPerfilHasPermissao')
        localStorage.removeItem('allPermissao')

    }

    perfilSelecionado(id){
        this.idPerfilSelecionado = id
        this.perfilSelecionadoTrue = true
        // função para carregar as permissões dispnoiveis
        this.verificarPermissaoDisponivelParaOPerfil(id)

    }

    verificarPermissaoDisponivelParaOPerfil(id){
        this.permissoes = JSON.parse(localStorage.getItem('allPermissao'))

        this.permissoes = this.permissoes.filter( permissao => {

            let resultado = this.perfilPermissoes.find(perfilPermissao => (
                perfilPermissao.permissao_id.id === permissao.id &&
                perfilPermissao.perfil_id.id === id
            ))
            if(!resultado){
                return permissao
            }
        })

    }

    checkBoxSelecionado(id){
        if(this.checkBoxSelecionadosArray.indexOf(id) > -1){
            this.checkBoxSelecionadosArray.splice(this.checkBoxSelecionadosArray.indexOf(id), 1)
        }else {
            this.checkBoxSelecionadosArray.push(id)
        }

    }

    listarTodasPermissoes(){
        this.subscriptions.push(
            this.permissaoService.getAllPermissao()
                .subscribe(
                    data => {
                        this.permissoes = data
                        localStorage.setItem('allPermissao', JSON.stringify(this.permissoes))
                    },
                    err => {
                        if(err.status === 401){
                            let msg = "seu permissao não é autorizado a listar perfils"
                            this.snackBar.open(msg, "Sem privilérios", { duration: 5000 })
                        }else{
                            let msg = "Erro ao obter listar de perfils"
                            this.snackBar.open(msg, "Erro", { duration: 5000 })
                        }
                    }
                )

        )
    }

    listarTodosPerfils(){
        this.subscriptions.push(
            this.perfilService.getAllPerfils()
                .subscribe(
                    data => {
                        this.perfils = data
                        localStorage.setItem('allPerfils', JSON.stringify(this.perfils))
                    },
                    err => {
                        if(err.status === 401){
                            let msg = "seu permissao não é autorizado a listar perfils"
                            this.snackBar.open(msg, "Sem privilérios", { duration: 5000 })
                        }else{
                            let msg = "Erro ao obter listar de perfils"
                            this.snackBar.open(msg, "Erro", { duration: 5000 })
                        }
                    }
                )

        )
    }

    listarTodasPerfilHasPermissao(){
        this.subscriptions.push(
            this.perfilPermissaoService.getAllPerfilPermissao()
                .subscribe(
                    data => {
                        this.perfilPermissoes = data
                        localStorage.setItem('allPerfilHasPermissao', JSON.stringify(this.perfilPermissoes))
                    },

                    err => {
                        if(err.status === 401){
                            let msg = "seu permissao não é autorizado a listar perfils e permissao"
                            this.snackBar.open(msg, "Sem privilérios", { duration: 5000 })
                        }else{
                            let msg = "Erro ao obter listar de perfils e permissao"
                            this.snackBar.open(msg, "Erro", { duration: 5000 })
                        }
                    }
                )
        )
    }

    pegarPerfil(id){
        this.perfil = this.perfils.find(x => x.id === id)
        if(!(this.perfil)){
            this.perfils = JSON.parse(localStorage.getItem('allPerfils'))
            this.perfil = this.perfils.find(x => x.id === id)
        }

    }

    pergarPermissao(id){
        this.permissao = this.permissoes.find(x => x.id === id)
        if(!(this.permissao)){
            this.permissoes = JSON.parse(localStorage.getItem('allPermissao'))
            this.permissao = this.permissoes.find(x => x.id === id)
        }
    }

    cadastrarPerfilHasPermissao(permissao: PerfilHasPermissao){
        this.subscriptions.push(
            this.perfilPermissaoService.createPerfilPermissao(permissao)
                .subscribe(
                    data => {
                    },
                    err => {
                        let msg = "Erro ao cadastrar a permissao" + permissao.permissao_id.descricao
                        this.snackBar.open(msg, "Erro", { duration: 5000 })
                    }
                )
        )

    }

    cadastrar(){
        if(this.perfilSelecionadoTrue === false){
            let msg = "Nenhum Perfil selecionado para cadastro"
            this.snackBar.open(msg, "Info", { duration: 5000 })
            return
        }else {
            if(this.checkBoxSelecionadosArray.length < 1){
                let msg = "Nenhuma permissão selecionada para cadastro"
                this.snackBar.open(msg, "Info", { duration: 5000 })
                return
            }
        }
        this.pegarPerfil(this.idPerfilSelecionado)
        this.checkBoxSelecionadosArray.forEach(p => {
            this.pergarPermissao(p)
            this.perfilHasPermissao.perfil_id = this.perfil
            this.perfilHasPermissao.permissao_id = this.permissao
            this.perfilHasPermissao.status = 1
            this.cadastrarPerfilHasPermissao(this.perfilHasPermissao)
        })
        let msg = "Finalizado o processo de cadastro de permissões!"
        this.router.navigate(['/permissao/pesquisar'])
        this.snackBar.open(msg, "Info", { duration: 4000 })



    }
}
