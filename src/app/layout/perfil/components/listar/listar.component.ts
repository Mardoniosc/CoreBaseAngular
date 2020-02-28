import { Component, OnInit, OnDestroy, Inject } from '@angular/core'
import { Subscription } from 'rxjs'
import {
    Perfil,
    PerfilService,
    PerfilHasPermissao,
    PerfilPermissaoService
} from 'src/app/shared'
import { Router } from '@angular/router';

import {
    MatDialog,
    MatSnackBar,
    MAT_DIALOG_DATA,
} from '@angular/material'

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = []

    perfil = {} as Perfil
    perfils: Perfil[]
    perfilHasPermissao: PerfilHasPermissao[]
    perfilHasPermissaoUnico = {} as PerfilHasPermissao



    perfilsFiltrados: Perfil[]
    totalDePerfils = 1
    advancedPagination: number;



    constructor(
        private perfilsService: PerfilService,
        private perfilHasPermissaoService: PerfilPermissaoService,
        public router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog

    ) {
        this.advancedPagination = 1;

     }

    ngOnInit() {
        this.listarTodosPerfils()
        this.listartAllPerfilHasPermissao()
    }

    ngOnDestroy(){
        localStorage.removeItem('perfilList')
        localStorage.removeItem('perfilHasPermissaoList')
        localStorage.removeItem('allPerfils')
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }

    pesquisa(termoPesquisa: string) {
        if(!termoPesquisa) {
            this.perfilsFiltrados = JSON.parse(localStorage.getItem('allPerfils'));
          } else {
            this.perfilsFiltrados = this.perfils.filter(x =>
               x.nome.trim().toLowerCase().includes(termoPesquisa.trim().toLowerCase())
            );
        }
        this.totalDePerfils = this.perfilsFiltrados.length
    }

    key: string = 'nome'; // Define um valor padrão, para quando inicializar o componente
    reverse: boolean = false;
    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    listarTodosPerfils(){
        this.subscriptions.push(this.perfilsService.getAllPerfils()
            .subscribe(
                data => {
                    this.perfils = data
                    this.totalDePerfils = this.perfils.length
                    localStorage.setItem('allPerfils', JSON.stringify(this.perfils))
                    this.pesquisa('')
                    // this.perfils = this.perfils.slice(0, 10)
                },
                err => {
                    if(err.status === 401){
                        let msg = "seu perfil não é autorizado a listar perfils"
                        this.snackBar.open(msg, "Sem privilérios", { duration: 5000 })
                    }else{
                        let msg = "Erro ao obter listar de usuários"
                        this.snackBar.open(msg, "Erro", { duration: 5000 })
                    }
                }
            ))
    }

    perfilHasPermissaoButton(id){
        this.subscriptions.push(
            this.perfilHasPermissaoService.getPerfilPermissaoId(id)
                .subscribe(
                    data => {
                        this.perfilHasPermissaoUnico = data
                        this.mudarPermissao(this.perfilHasPermissaoUnico)
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
            this.perfilHasPermissaoService.updatePerfilPermissao(permissao, permissao.id)
                .subscribe(
                    data => {
                        this.listarTodosPerfils()
                        this.listartAllPerfilHasPermissao()
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

    listartAllPerfilHasPermissao(){
        this.subscriptions.push(
            this.perfilHasPermissaoService.getAllPerfilPermissao()
                .subscribe(
                    data => {
                        this.perfilHasPermissao = data
                        localStorage.setItem('perfilHasPermissaoList', JSON.stringify(this.perfilHasPermissao))
                    },
                    err => {
                        if(err.status === 401){
                            let msg = "seu perfil não é autorizado a listar perfils"
                            this.snackBar.open(msg, "Sem privilérios", { duration: 5000 })
                        }else{
                            let msg = "Erro ao obter listar de perfils"
                            this.snackBar.open(msg, "Erro", { duration: 5000 })
                        }
                    },

                )
        )
    }

    removerDialog(perfilID: string ) {
        this.subscriptions.push(this.perfilsService.getPerfilId(perfilID)
            .subscribe(
            data => {
                this.perfil = data;
                const dialog = this.dialog.open(ConfirmarDialog, {
                data: { nome: this.perfil.nome }
                })
                dialog.afterClosed().subscribe(remover => {
                if(remover){
                    this.removerPerfil(perfilID)
                }
                });
            },
            err => {
                let msg = "Erro ao tentar excluir perfil selecionado"
                this.snackBar.open(msg, "Erro", { duration: 5000 })
            }
            ))

    }

    removerPerfil(id){
    this.subscriptions.push(this.perfilsService.deletePerfil(id)
        .subscribe(
        data => {
            let msg = "Perfil excluído com sucesso!"
            this.snackBar.open(msg, "Sucesso", { duration: 5000 })
            this.listarTodosPerfils()
        },
        err => {
            if(err.status === 500){
                let msg = "Perfil não pode ser excluido pois existem usuários cadastrados com este perfil"
                this.snackBar.open(msg, "Info", { duration: 6000 })
            }else{
                let msg = "Erro ao buscar informações do perfil selecionado";
                this.snackBar.open(msg, "Erro", { duration: 4000 })
            }
        }
        ))
    }
}

@Component({
    selector: 'confirmar-dialog',
    template: `
    <h1 mat-dialog-title>Deseja realmente remover o perfil {{ data.nome }}?</h1>
    <div mat-dialog-actions>
        <button mat-button [mat-dialog-close]="false" tabindex="-1">
        Não
        </button>
        <button mat-button [mat-dialog-close]="true" tabindex="2">
        Sim
        </button>
    </div>
    `,
})
export class ConfirmarDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Perfil) {}
}
