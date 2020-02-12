import { Component, OnInit } from '@angular/core';
import { Usuario, CpfValidator } from 'src/app/shared';
import { UsuariosService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router'
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-atualizacao',
  templateUrl: './atualizacao.component.html',
  styleUrls: ['./atualizacao.component.css']
})
export class AtualizacaoComponent implements OnInit {

  usuarioCarregado = false
  form: FormGroup
  hide = true

  usuario = {} as Usuario
  userId: string

  teste: string = "Mardonio"

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuariosService
  ) { }

  ngOnInit() {
    this.gerarForm()
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.buscarUserId()
  }

  gerarForm(){
    this.form = this.fb.group({
      nome: ['' ,[Validators.required]],
      email: ['' ,[Validators.required, Validators.email]],
      login: ['',[Validators.required, Validators.minLength(4)]],
      cpf: ['',[Validators.required, CpfValidator]],
      senha: ['',[Validators.required, Validators.minLength(6)]],
    })
  }

  atualizar(){
    if(this.form.invalid){
      let msg = "Formulário com campos inválidos favor verificar!"
      this.snackBar.open(msg, "Aviso", { duration: 4000 })
      return
    }
    const usuario: Usuario = this.form.value;

    this.usuarioService.updateUser(usuario, this.usuario.id)
      .subscribe(
        data => {
          let msg = "Usuario atualizado com sucesso!"
          this.snackBar.open(msg, "Sucesso", { duration: 4000 })
          this.router.navigate(['/admin'])
        },
        err => {
          let msg = "Erro ao atualizar dados do usuário"
          this.snackBar.open(msg, "Erro", { duration: 4000 })
        }
      )
  }

  buscarUserId(){
    this.usuarioService.getUserId(this.userId)
      .subscribe(
        data => {
          this.usuario = data
          this.form.setValue( {
            nome: this.usuario.nome,
            email: this.usuario.email,
            cpf: this.usuario.cpf,
            login: this.usuario.login,
            senha: this.usuario.senha,
          } )
          this.usuarioCarregado = true
        },
        err => {
          if(err.status === 500 ){
            let msg = "usuaŕio informado não encontrado na base de dados"
            this.snackBar.open(msg, "Erro", { duration: 5000 })
            this.router.navigate(['/admin'])
          }else{
            let msg = "Erro ao buscar dados do usuário tente novamente"
            this.snackBar.open(msg, "Erro", { duration: 4000 })
            this.router.navigate(['/admin'])
          }
        }
      )
  }
}
