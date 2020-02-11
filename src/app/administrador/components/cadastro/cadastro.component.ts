import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { UsuariosService, Usuario } from 'src/app/shared';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuariosService
  ) { }

  ngOnInit() {
    this.gerarForm()
  }
  gerarForm(){
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      login: ['', [Validators.required, Validators.minLength(4)]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  cadastrar(){
    const usuario: Usuario = this.form.value;

    this.usuarioService.createUser(usuario)
      .subscribe(
        data => {
          let msg = "Usuaŕio cadastrado com sucesso!"
          this.snackBar.open(msg, "Erro", { duration: 4000 })
          this.router.navigate(['/admin'])
        },
        err => {
          let msg = "Erro ao cadastrar usuário"
          this.snackBar.open(msg, "Erro", { duration: 4000 })
        }
      )
  }
}
