import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';

import { LoginService } from '../../services'
import { Login } from '../../models'
import { httpOptions } from '../../../../shared'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    localStorage.removeItem('userToken')
    this.criarForm()
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
    const login: Login = this.form.value;
    this.loginService.logar(login, httpOptions)
      .subscribe(
        data => {
          localStorage.setItem('userToken', JSON.stringify(data.access_token))
          let msg = "Bem-vindo!"
          this.snackBar.open( msg, "Sucesso", { duration: 3000 })
          this.router.navigate(['/admin'])
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
      )
  }

}
