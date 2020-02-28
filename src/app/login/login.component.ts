import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Md5 } from 'ts-md5/dist/md5'
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material'

import {
    httpOptions,
    Usuario,
    UsuariosService,
} from '../shared'

import { Login } from './models'
import { LoginService } from './services'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    private subscriptions: Subscription[] = []

    usuarios: Usuario[]
    usuario = {} as Usuario
    login = {} as Login
    form: FormGroup

    constructor(
      private fb: FormBuilder,
      private router: Router,
      private loginService: LoginService,
      private usuarioService: UsuariosService,
      private snackBar: MatSnackBar,
    ) { }

    ngOnInit() {
        localStorage.clear()
        this.criarForm()
        this.verificaUsuarioLogado()
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
              console.log(msg)
              this.snackBar.open( msg, "Erro", { duration: 3000 })
            }else{
              let msg = 'Deu erro em alguma lugar veja o log'
              console.log(msg)
              this.snackBar.open( msg, "Erro", { duration: 3000 })
            }
            console.log(err)
          }
        ))
    }

    logarBanco(){
        const md5 = new Md5();
        this.login = this.form.value
    //   this.login.password = this.cryptoService.encrypt(this.login.password, codigoCrypt)
        this.login.password = md5.appendStr(this.login.password).end().toString()
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
                      this.router.navigate(['/dashboard'])
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
      localStorage.clear()
    }

    verificaUsuarioLogado(){
      if (localStorage.getItem('userToken')){
        this.router.navigate([`/dashboard`])
      }
    }

  }
