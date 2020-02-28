import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import {
    PerfilHasPermissao,
    PerfilPermissaoService,
    Usuario
} from '../../../shared'
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    menuUsuario: string;
    menuPerfil: string;
    menuPermissao: string;
    pushRightClass: string;

    private subscriptions: Subscription[] = []

    // variaveis de Menu

    // usuario
    usuario: boolean = false
    usuario_pesquisar: boolean = false
    usuario_cadastrar: boolean = false

    // Permissao
    permissao: boolean = false
    permissao_pesquisar: boolean = false
    permissao_cadastrar: boolean = false

    //Perfil
    perfil: boolean = false
    perfil_pesquisar: boolean = false
    perfil_cadastrar: boolean = false

    perfilHasPermissao = {} as PerfilHasPermissao
    usuarioLogado = {} as Usuario
    perfilHasPermissoes : PerfilHasPermissao[]

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(
        public router: Router,
        private perfilPermissaoService: PerfilPermissaoService,
    ) {
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.collapsed = false
        this.isActive = false
        this.showMenu = ''
        this.menuUsuario = ''
        this.menuPerfil = ''
        this.menuPermissao = ''
        this.pushRightClass = 'push-right'
        this.carregarTodasPermissoes()
    }

    abrirMenuUsuario(element: any) {
        if (element === this.menuUsuario) {
            this.menuUsuario = '0';
        } else {
            this.menuUsuario = element;
        }
    }

    abrirMenuPerfil(element: any) {
        if (element === this.menuPerfil) {
            this.menuPerfil = '0';
        } else {
            this.menuPerfil = element;
        }
    }

    abrirMenuPermissao(element: any) {
        if (element === this.menuPermissao) {
            this.menuPermissao = '0';
        } else {
            this.menuPermissao = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    encolherBarradeMenu() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    ngOnDestroy(){
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }

    carregarTodasPermissoes(){
        this.subscriptions.push(this.perfilPermissaoService.getAllPerfilPermissao()
            .subscribe(
                data => {
                    this.perfilHasPermissoes = data
                    this.validandoMenuVisivel()
                },
                err => {}
            ))
    }
    validandoMenuVisivel(){

        this.usuarioLogado = JSON.parse(localStorage.getItem('UsuarioLogado'))

        this.perfilHasPermissoes = this.perfilHasPermissoes.filter(
            pp => {
                if(pp.perfil_id.id === this.usuarioLogado.perfil.id){
                    if(pp.status === 1){
                        this.habilitarOpcaoMenu(pp.permissao_id.descricao)
                    }
                }
            }
        )


    }

    habilitarOpcaoMenu(descricao){
        console.log(descricao)
        switch(descricao){
            case 'Usuário':
                this.usuario = true
                break
            case 'Cadastrar Usuário':
                this.usuario_cadastrar = true
                break
            case 'Pesquisar Usuário':
                this.usuario_pesquisar = true
                break
            case 'Perfil':
                this.perfil = true
                break
            case 'Cadastrar Perfil':
                this.perfil_cadastrar = true
                break
            case 'Pesquisar Perfil':
                this.perfil_pesquisar = true
                break
            case 'Permissão':
                this.permissao = true
                break
            case 'Cadastrar Permissão':
                this.permissao_cadastrar = true
                break
            case 'Pesquisar Permissão':
                this.permissao_pesquisar = true
                break
        }
    }

}
