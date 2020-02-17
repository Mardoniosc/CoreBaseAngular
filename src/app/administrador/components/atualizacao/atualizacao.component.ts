import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Usuario, CpfValidator, Perfil, codigoCrypt } from 'src/app/shared';
import { UsuariosService, PerfilService, CryptoService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router'
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatSelect } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-atualizacao',
  templateUrl: './atualizacao.component.html',
  styleUrls: ['./atualizacao.component.css']
})
export class AtualizacaoComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = []

  usuarioCarregado = false
  form: FormGroup
  hide = true

  perfils: Perfil[]
  @ViewChild(MatSelect, { static: true }) matSelect: MatSelect
  perfilUser: Perfil
  perfil_id: number

  usuario = {} as Usuario
  userId: string

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuariosService,
    private perfilService: PerfilService,
    private cryptoService: CryptoService
  ) { }

  ngOnInit() {
    this.gerarForm()
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.buscarUserId()
    this.obterPerfils()
  }

  ngOnDestroy(){
    this.subscriptions.forEach(subscription => subscription.unsubscribe())

  }

  gerarForm(){
    this.form = this.fb.group({
      nome: ['' ,[Validators.required]],
      email: ['' ,[Validators.required, Validators.email]],
      login: ['',[Validators.required, Validators.minLength(4)]],
      cpf: ['',[Validators.required, CpfValidator]],
      senha: ['',[Validators.required, Validators.minLength(6)]],
      perfil: ['', [Validators.required]]
    })
  }

  atualizar(){
    if(this.form.invalid){
      let msg = "Formulário com campos inválidos favor verificar!"
      this.snackBar.open(msg, "Aviso", { duration: 4000 })
      return
    }
    this.usuario = this.form.value;
    this.usuario.perfil = this.perfilUser
    this.usuario.senha = this.cryptoService.encrypt(this.usuario.senha, codigoCrypt)
    this.subscriptions.push(this.usuarioService.updateUser(this.usuario, this.userId)
      .subscribe(
        data => {
          let msg = "Usuario atualizado com sucesso!"
          this.snackBar.open(msg, "Sucesso", { duration: 4000 })
          this.router.navigate(['/admin'])
        },
        err => {
          let msg = "Erro ao atualizar dados do usuário"
          this.snackBar.open(msg, "Erro", { duration: 4000 })
          console.log(err)
        }
      ))
  }

  perfilSelecionado(){
    if(this.matSelect.selected) {
      this.perfil_id = this.matSelect.selected['value']
      this.subscriptions.push(this.perfilService.getPerfilId(this.perfil_id)
        .subscribe(
          data => {
            this.perfilUser = data
            console.log(this.perfilUser)
          },
          err => {
            console.log('Erro ao buscaar perfil selecionado')
          }
        ))
    }else {
      return
    }
  }

  obterPerfils(){
    this.subscriptions.push(this.perfilService.getAllPerfils()
      .subscribe(
        data => {
          this.perfils = data
        },
        err => {
          let msg = 'Erro ao obter perfils cadastrados'
          this.snackBar.open(msg, "Erro", { duration: 4000 })
          console.log(err)
        }
      ))
  }

  buscarUserId(){
    this.subscriptions.push(this.usuarioService.getUserId(this.userId)
      .subscribe(
        data => {
          this.usuario = data
          console.log(this.usuario.senha)
          this.usuario.senha = this.cryptoService.decrypt(this.usuario.senha, codigoCrypt)
          localStorage.setItem('dataUser', JSON.stringify(this.usuario))
          console.log(this.usuario)
          this.form.setValue( {
            nome: this.usuario.nome,
            email: this.usuario.email,
            cpf: this.usuario.cpf,
            login: this.usuario.login,
            senha: this.usuario.senha,
            perfil: this.usuario.perfil !== null ? this.usuario.perfil['id'] : null,
          } )
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
      ))
  }
}
