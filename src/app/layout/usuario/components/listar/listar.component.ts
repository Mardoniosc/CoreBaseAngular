import { Component, OnInit, OnDestroy, Inject } from '@angular/core'
import { Subscription } from 'rxjs'
import { Usuario, UsuariosService } from 'src/app/shared'
import { Router } from '@angular/router'
import { OrderPipe } from 'ngx-order-pipe'

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

    usuario = {} as Usuario
    usuarios: Usuario[]
    usuariosFiltrados: Usuario[]

    totalDeUsuarios = 1
    advancedPagination: number;

    constructor(
        private usuariosService: UsuariosService,
        public router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog

    ) {
        this.advancedPagination = 1;

     }

    ngOnInit() {
        this.listarTodosUsuarios()
    }

    ngOnDestroy(){
        localStorage.removeItem('usersList')
        localStorage.removeItem('allUsers')
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }

    pesquisa(termoPesquisa: string) {
        if(!termoPesquisa) {
            this.usuariosFiltrados = JSON.parse(localStorage.getItem('allUsers'));
          } else {
            this.usuariosFiltrados = this.usuarios.filter(x =>
               x.nome.trim().toLowerCase().includes(termoPesquisa.trim().toLowerCase())
            );
        }
        this.totalDeUsuarios = this.usuariosFiltrados.length
    }

    listarTodosUsuarios(){
        this.subscriptions.push(this.usuariosService.getAllUsers()
            .subscribe(
                data => {
                    this.usuarios = data
                    this.totalDeUsuarios = this.usuarios.length
                    localStorage.setItem('allUsers', JSON.stringify(this.usuarios))
                    this.pesquisa('')
                    // this.usuarios = this.usuarios.slice(0, 10)
                },
                err => {
                    if(err.status === 401){
                        let msg = "seu perfil não é autorizado a listar usuários"
                        this.snackBar.open(msg, "Sem privilérios", { duration: 5000 })
                    }else{
                        let msg = "Erro ao obter listar de usuários"
                        this.snackBar.open(msg, "Erro", { duration: 5000 })
                    }
                }
            ))
    }

    removerDialog(usuarioID: string ) {
        this.subscriptions.push(this.usuariosService.getUserId(usuarioID)
            .subscribe(
            data => {
                this.usuario = data;
                const dialog = this.dialog.open(ConfirmarDialog, {
                data: { nome: this.usuario.nome }
                })
                dialog.afterClosed().subscribe(remover => {
                if(remover){
                    this.removerUsuario(usuarioID)
                }
                });
            },
            err => {
                let msg = "Erro ao tentar excluir usuário selecionado"
                this.snackBar.open(msg, "Erro", { duration: 5000 })
            }
            ))

    }

    key: string = 'nome'; // Define um valor padrão, para quando inicializar o componente
    reverse: boolean = false;
    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    removerUsuario(id){
    this.subscriptions.push(this.usuariosService.deleteUser(id)
        .subscribe(
        data => {
            let msg = "Usuário excluído com sucesso!"
            this.snackBar.open(msg, "Sucesso", { duration: 5000 })
            this.listarTodosUsuarios()
        },
        err => {
            let msg = "Erro ao buscar informações do usuário selecionado";
            this.snackBar.open(msg, "Erro", { duration: 4000 })
        }
        ))
    }
}

@Component({
    selector: 'confirmar-dialog',
    template: `
    <h1 mat-dialog-title>Deseja realmente remover o usuário {{ data.nome }}?</h1>
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
    constructor(@Inject(MAT_DIALOG_DATA) public data: Usuario) {}
}
