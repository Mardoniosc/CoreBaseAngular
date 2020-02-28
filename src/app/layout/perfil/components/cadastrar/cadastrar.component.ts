import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {
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

    perfil = {} as Perfil

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router,
        private perfilService: PerfilService,
    ) { }

    ngOnInit() {
        this.gerarForm()
    }

    ngOnDestroy(){
        this.subscriptions.forEach(subscription => subscription.unsubscribe())

    }

    gerarForm(){
        this.form = this.fb.group({
            nome: ['', [Validators.required]]
        })
    }

    cadastrar(){
        if(this.form.invalid){
            this.form.get('nome').markAsTouched()

            let msg = "Formulário com campos invalidos!"
            this.snackBar.open(msg, "Erro", { duration: 4000 })
            return
        }
        this.perfil = this.form.value;
        this.subscriptions.push(this.perfilService.createPerfil(this.perfil)
        .subscribe(
            data => {
                let msg = "Perfil cadastrado com sucesso!"
                this.snackBar.open(msg, "Sucesso", { duration: 4000 })
                this.router.navigate(['/perfil/pesquisar'])
            },
            err => {
                let msg = "Erro ao cadastrar Perfil"
                this.snackBar.open(msg, "Erro", { duration: 4000 })
            }
        ))
    }
}
