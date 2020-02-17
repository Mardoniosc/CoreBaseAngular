import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';

import { LoginService } from '../../services'
import { Login } from '../../models'
import {
  httpOptions,
  Usuario,
  UsuariosService,
  codigoCrypt,
  CryptoService
} from 'src/app/shared'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = []

  usuarios: Usuario[]
  usuario = {} as Usuario
  login = {} as Login
  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService,
    private usuarioService: UsuariosService,
    private cryptoService: CryptoService
  ) { }

  ngOnInit() {
    this.clearLocalStorange()
    this.criarForm()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  criarForm(){
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  cadastrar(){
    const mensagem = "Em desenvolvimento..."
    this.snackBar.open(mensagem, "Info", { duration: 5000 })
  }

  logar(){
    // limpa todo o localStorange
    this.clearLocalStorange()
    // const login: Login = this.form.value;
    console.log('Logando no wso2')
    const login = { username: "tecnisys", password: "tecnisys" }
    this.subscriptions.push(this.loginService.logarWSO2(login, httpOptions)
      .subscribe(
        data => {
          localStorage.setItem('refreshToken', JSON.stringify(data.refresh_token))
          localStorage.setItem('userToken', JSON.stringify(data.access_token))
          localStorage.setItem('expireToken', JSON.stringify(data.expires_in))
          this.logarBanco()
        },
        err => {
          if (err.error.error ===  'invalid_grant'){
            let msg = 'usuario ou senha incorretos'
            this.snackBar.open( msg, "Erro", { duration: 3000 })
          }else{
            let msg = 'Deu erro em alguma lugar veja o log'
            this.snackBar.open( msg, "Erro", { duration: 3000 })
          }
          console.log(err)
        }
      ))
  }

  direcionaDeAcordoComPerfil(perfil){
    switch(perfil){
      case 'Administrador':
        this.router.navigate(['/admin'])
        break
      case 'Administrador Master':
        this.router.navigate(['/admin'])
        break
      case 'Servidor':
        this.router.navigate(['/servidor'])
        break
      case 'Operador':
        this.router.navigate(['/operador'])
        break
    }
  }
  logarBanco(){
    this.login = this.form.value
    this.login.password = this.cryptoService.encrypt(this.login.password, codigoCrypt)
    this.subscriptions.push(this.usuarioService.getAllUsers()
      .subscribe(
        data => {
          this.usuarios = data
          let autenticado = false
          for (var i = 0, len = this.usuarios.length; i < len; i++){
              this.usuarios[i].login
              if (
                this.usuarios[i].login === this.login.username
                  && this.usuarios[i].senha === this.login.password
                  ){
                    localStorage.setItem('UsuarioLogado', JSON.stringify(this.usuarios[i]))
                    let perfil_user = this.usuarios[i].perfil.nome
                    this.direcionaDeAcordoComPerfil(perfil_user)
                    autenticado = true
                    break
            }
          }
          if(!autenticado){
            this.clearLocalStorange()
            let msg = 'usuário ou senha incorretos'
            this.snackBar.open(msg, "Erro", { duration: 3000 })
          }

        },

        err => {
          let msg = "Erro ao tentar validar o usuário informado"
          this.snackBar.open(msg, "Erro", { duration: 3000 })
        }

      ))
  }

  clearLocalStorange(){
    localStorage.removeItem('userToken')
    localStorage.removeItem('UsuarioLogado')
    localStorage.removeItem('dataLogin')
    localStorage.removeItem('dataUser')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expireToken')
  }

}
