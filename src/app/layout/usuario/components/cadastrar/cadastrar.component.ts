import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSelect } from '@angular/material';
import { Md5 } from 'ts-md5/dist/md5'

import {
  UsuariosService,
  Usuario,
  CpfValidator,
  PerfilService,
  Perfil,
} from 'src/app/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = []

    form: FormGroup
    hide = true
    usuario = {} as Usuario

    perfils: Perfil[]
    @ViewChild(MatSelect, { static: true }) matSelect: MatSelect
    perfilUser: Perfil

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private router: Router,
        private usuarioService: UsuariosService,
        private perfilService: PerfilService,
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
        if(this.form.invalid){
            let msg = "Formulário com campos invalidos!"
            this.snackBar.open(msg, "Erro", { duration: 4000 })
            this.toucheCamposFormulario()
            return
        }

        const md5 = new Md5();

        this.usuario = this.form.value;
        this.usuario.perfil = this.perfilUser
        this.usuario.status = 1
        this.usuario.senha = md5.appendStr(this.usuario.senha).end().toString()
        this.usuario.criado = new Date()
        this.subscriptions.push(this.usuarioService.createUser(this.usuario)
            .subscribe(
                data => {
                    let msg = "Usuaŕio cadastrado com sucesso!"
                    this.snackBar.open(msg, "Sucesso", { duration: 4000 })
                    this.router.navigate(['/usuario/pesquisar'])
                },
                err => {
                    let msg = "Erro ao cadastrar usuário"
                    this.snackBar.open(msg, "Erro", { duration: 4000 })
                }
            ))
    }

    perfilSelecionado(perfilId){
            if(perfilId) {
                this.subscriptions.push(this.perfilService.getPerfilId(perfilId)
                    .subscribe(
                        data => {
                            console.log(data)
                            this.perfilUser = data
                        },
                        err => {
                            let msg = 'Erro ao obter perfils selecionado'
                            this.snackBar.open(msg, "Erro", { duration: 4000 })
                        }
                    )
                )
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

    toucheCamposFormulario(){
        this.form.get('cpf').markAsTouched()
        this.form.get('email').markAsTouched()
        this.form.get('login').markAsTouched()
        this.form.get('senha').markAsTouched()
        this.form.get('perfil').markAsTouched()
        this.form.get('nome').markAsTouched()
    }
}
