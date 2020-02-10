import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../services'
import { Login } from '../../models'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: Login

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit() {
  }

  logar(){
    this.loginService.logar(this.login)
      .subscribe(
        data => {
          console.log(data)
        },
        err => {
          alert('Deu erro em alguma lugar veja o log')
          console.log(err.error.errrors.join(' '))
        }
      )
  }

}
