import { Component, OnInit, OnDestroy } from '@angular/core';
import { Permissao, PermissaoService } from 'src/app/shared';
import { Router, ActivatedRoute } from '@angular/router'
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-atualizar',
  templateUrl: './atualizar.component.html',
  styleUrls: ['./atualizar.component.scss']
})
export class AtualizarComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = []

    permissaoCarregado = false
    form: FormGroup
    permissaoId: string
    permissao = {} as Permissao

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
        private permissaoService: PermissaoService,
    ) { }

    ngOnInit() {
        this.gerarForm()
        this.permissaoId = this.route.snapshot.paramMap.get('permissaoId');
        this.buscarPermissaoId()
    }

    ngOnDestroy(){
        this.subscriptions.forEach(subscription => subscription.unsubscribe())

    }

    gerarForm(){
        this.form = this.fb.group({
            descricao: ['' ,[Validators.required, Validators.minLength(4)]],
            url: ['' ,[Validators.required]],
        })
    }

    atualizar(){
        if(this.form.invalid){
            let msg = "Formulário com campos inválidos favor verificar!"
            this.snackBar.open(msg, "Aviso", { duration: 4000 })
            return
        }
        this.permissao = this.form.value;
        this.subscriptions.push(this.permissaoService.updatePermissao(this.permissao, this.permissaoId)
            .subscribe(
                data => {
                    let msg = "permissao atualizado com sucesso!"
                    this.snackBar.open(msg, "Sucesso", { duration: 4000 })
                    this.router.navigate(['/permissao/pesquisar'])
                },
                err => {
                    let msg = "Erro ao atualizar dados do usuário"
                    this.snackBar.open(msg, "Erro", { duration: 4000 })
                    console.log(err)
                }
            ))
    }

    buscarPermissaoId(){
        this.subscriptions.push(this.permissaoService.getPermissaoId(this.permissaoId)
        .subscribe(
            data => {
                this.permissao = data
                localStorage.setItem('dataPermissao', JSON.stringify(this.permissao))
                console.log(this.permissao)
                this.form.setValue( {
                    descricao: this.permissao.descricao,
                    url: this.permissao.url,
                })
            },
            err => {
                if(err.status === 500 ){
                    let msg = "permissao informado não encontrado na base de dados"
                    this.snackBar.open(msg, "Erro", { duration: 5000 })
                    this.router.navigate(['/permissao/pesquisar'])
                }else{
                    let msg = "Erro ao buscar dados do permissao tente novamente"
                    this.snackBar.open(msg, "Erro", { duration: 4000 })
                    this.router.navigate(['/permissao/pesquisar'])
                }
            }
        ))
    }
}
