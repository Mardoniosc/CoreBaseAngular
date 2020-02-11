import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections'
import {
  MatTableDataSource,
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSort,
  MatPaginator
} from '@angular/material'

import { Observable } from 'rxjs'

import { Usuario } from 'src/app/shared/models';
import { UsuariosService } from 'src/app/shared/services';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.css']
})
export class ListagemComponent implements OnInit {

  dataSource: MatTableDataSource<Usuario>
  colunas: string[] = ['nome', 'email', 'login', 'cpf', 'acao']

  usuario = {} as Usuario
  usuarios: Usuario[]

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.listarTodosUsuarios()
  }

  listarTodosUsuarios(){
    this.usuariosService.getAllUsers()
      .subscribe(
        data => {
          this.usuarios = data
          this.dataSource = new MatTableDataSource<Usuario>(this.usuarios)
          this.dataSource.sort = this.sort
          this.dataSource.paginator = this.paginator
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
      )
  }

  removerDialog(usuarioID: string ) {
    this.usuariosService.getUserId(usuarioID)
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
      )

  }

  removerUsuario(id){
    this.usuariosService.deleteUser(id)
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
      )
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
