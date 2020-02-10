import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';

import { LoginService } from '../../services'
import { Login } from '../../models'

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
  }

  criarForm(){
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  logar(){

    const login: Login = this.form.value;
    this.loginService.logar(login)
      .subscribe(
        data => {
          let msg = "Deu certo veja o logue"
          console.log(data)
          this.snackBar.open( msg, "Sucesso", { duration: 3000 })

        },
        err => {
          let msg = 'Deu erro em alguma lugar veja o log'
          console.log(err.error.errrors.join(' '))
          this.snackBar.open( msg, "Erro", { duration: 3000 })
        }
      )
  }

}
