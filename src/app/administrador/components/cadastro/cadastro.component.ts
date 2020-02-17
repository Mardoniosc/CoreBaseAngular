import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSelect } from '@angular/material';
import {
  UsuariosService,
  Usuario,
  CpfValidator,
  PerfilService,
  Perfil,
  CryptoService,
  codigoCrypt
} from 'src/app/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = []

  form: FormGroup
  hide = true
  usuario = {} as Usuario

  perfils: Perfil[]
  @ViewChild(MatSelect, { static: true }) matSelect: MatSelect
  perfilUser: Perfil
  perfil_id: number

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
    this.obterPerfils()
  }

  ngOnDestroy(){
    this.subscriptions.forEach(subscription => subscription.unsubscribe())

  }

  gerarForm(){
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      login: ['', [Validators.required, Validators.minLength(4)]],
      cpf: ['', [Validators.required, CpfValidator]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['', [Validators.required]]
    })
  }

  cadastrar(){
    this.usuario = this.form.value;
    this.usuario.perfil = this.perfilUser
    this.usuario.senha = this.cryptoService.encrypt(this.usuario.senha, codigoCrypt)
    this.usuario.criado = new Date()
    console.log(this.usuario.criado)
    this.subscriptions.push(this.usuarioService.createUser(this.usuario)
      .subscribe(
        data => {
          let msg = "Usuaŕio cadastrado com sucesso!"
          this.snackBar.open(msg, "Sucesso", { duration: 4000 })
          this.router.navigate(['/admin'])
        },
        err => {
          let msg = "Erro ao cadastrar usuário"
          this.snackBar.open(msg, "Erro", { duration: 4000 })
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
          },
          err => {
            let msg = 'Erro ao obter perfils selecionado'
            this.snackBar.open(msg, "Erro", { duration: 4000 })
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
        }
      ))
  }
}
