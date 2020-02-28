import { Component, OnInit, OnDestroy } from '@angular/core';
import { Perfil, PerfilService } from 'src/app/shared';
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

    perfilCarregado = false
    form: FormGroup
    perfilId: string
    perfil = {} as Perfil

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
        private perfilService: PerfilService,
    ) { }

    ngOnInit() {
        this.gerarForm()
        this.perfilId = this.route.snapshot.paramMap.get('perfilId');
        this.buscarPerfilId()
    }

    ngOnDestroy(){
        this.subscriptions.forEach(subscription => subscription.unsubscribe())

    }

    gerarForm(){
        this.form = this.fb.group({
            nome: ['' ,[Validators.required]],
        })
    }

    atualizar(){
        if(this.form.invalid){
            let msg = "Formulário com campos inválidos favor verificar!"
            this.snackBar.open(msg, "Aviso", { duration: 4000 })
            return
        }
        this.perfil = this.form.value;
        this.subscriptions.push(this.perfilService.updatePerfil(this.perfil, this.perfilId)
            .subscribe(
                data => {
                    let msg = "perfil atualizado com sucesso!"
                    this.snackBar.open(msg, "Sucesso", { duration: 4000 })
                    this.router.navigate(['/perfil/pesquisar'])
                },
                err => {
                    let msg = "Erro ao atualizar dados do usuário"
                    this.snackBar.open(msg, "Erro", { duration: 4000 })
                    console.log(err)
                }
            ))
    }

    buscarPerfilId(){
        this.subscriptions.push(this.perfilService.getPerfilId(this.perfilId)
        .subscribe(
            data => {
                this.perfil = data
                localStorage.setItem('dataPerfil', JSON.stringify(this.perfil))
                console.log(this.perfil)
                this.form.setValue( {
                    nome: this.perfil.nome,
                })
            },
            err => {
                if(err.status === 500 ){
                    let msg = "perfil informado não encontrado na base de dados"
                    this.snackBar.open(msg, "Erro", { duration: 5000 })
                    this.router.navigate(['/perfil/pesquisar'])
                }else{
                    let msg = "Erro ao buscar dados do perfil tente novamente"
                    this.snackBar.open(msg, "Erro", { duration: 4000 })
                    this.router.navigate(['/perfil/pesquisar'])
                }
            }
        ))
    }
}
