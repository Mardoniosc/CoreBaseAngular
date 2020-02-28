import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Usuario, CpfValidator, Perfil, codigoCrypt } from 'src/app/shared';
import { UsuariosService, PerfilService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router'
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatSelect } from '@angular/material';
import { Subscription } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5'

@Component({
  selector: 'app-atualizar',
  templateUrl: './atualizar.component.html',
  styleUrls: ['./atualizar.component.scss']
})
export class AtualizarComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = []

    usuarioCarregado = false
    form: FormGroup
    hide = true

    perfils: Perfil[]
    @ViewChild(MatSelect, { static: true }) matSelect: MatSelect
    perfilUser: Perfil
    perfil_id: number

    usuario = {} as Usuario
    userId: string

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
        this.userId = this.route.snapshot.paramMap.get('userId');
        this.buscarUserId()
        this.obterPerfils()
    }

    ngOnDestroy(){
        this.subscriptions.forEach(subscription => subscription.unsubscribe())

    }

    gerarForm(){
        this.form = this.fb.group({
            nome: ['' ,[Validators.required]],
            email: ['' ,[Validators.required, Validators.email]],
            login: ['',[Validators.required, Validators.minLength(4)]],
            cpf: ['',[Validators.required, CpfValidator]],
            senha: ['',[Validators.required, Validators.minLength(6)]],
            perfil: ['', [Validators.required]]
        })
    }

    atualizar(){
        if(this.form.invalid){
            this.toucheCamposFormulario()
            let msg = "Formulário com campos inválidos favor verificar!"
            this.snackBar.open(msg, "Aviso", { duration: 4000 })
            return
        }
        const md5 = new Md5();
        this.usuario = this.form.value;
        this.usuario.perfil = this.perfilUser
        this.usuario.senha = md5.appendStr(this.usuario.senha).end().toString()
        this.subscriptions.push(this.usuarioService.updateUser(this.usuario, this.userId)
            .subscribe(
                data => {
                let msg = "Usuario atualizado com sucesso!"
                this.snackBar.open(msg, "Sucesso", { duration: 4000 })
                this.router.navigate(['/usuario/pesquisar'])
                },
                err => {
                let msg = "Erro ao atualizar dados do usuário"
                this.snackBar.open(msg, "Erro", { duration: 4000 })
                }
            ))
    }

    perfilSelecionado(perfilId){
        if(perfilId) {
            this.subscriptions.push(this.perfilService.getPerfilId(perfilId)
                .subscribe(
                    data => {
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

    buscarUserId(){
        this.subscriptions.push(this.usuarioService.getUserId(this.userId)
        .subscribe(
            data => {
                this.usuario = data
                localStorage.setItem('dataUser', JSON.stringify(this.usuario))
                this.form.setValue( {
                    nome: this.usuario.nome,
                    email: this.usuario.email,
                    cpf: this.usuario.cpf,
                    login: this.usuario.login,
                    senha: '',
                    perfil: this.usuario.perfil !== null ? this.usuario.perfil['id'] : null,
                } )
            },
            err => {
                if(err.status === 500 ){
                    let msg = "usuaŕio informado não encontrado na base de dados"
                    this.snackBar.open(msg, "Erro", { duration: 5000 })
                    this.router.navigate(['/usuario/pesquisar'])
                }else{
                    let msg = "Erro ao buscar dados do usuário tente novamente"
                    this.snackBar.open(msg, "Erro", { duration: 4000 })
                    this.router.navigate(['/usuario/pesquisar'])
                }
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
