import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Usuario } from 'src/app/shared';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    usuario = {} as Usuario

    public pushRightClass: string;

    constructor( public router: Router) {
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
        this.pushRightClass = 'push-right'
        this.verificaUsuarioLogado()
    }

    ngOnDestroy(){
        localStorage.clear()
    }
    verificaUsuarioLogado(){
        if (!(localStorage.getItem('userToken'))){
            this.router.navigate([`/`])
        }else{
            this.usuario = JSON.parse(localStorage.getItem('UsuarioLogado'))
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }


    sair() {
        localStorage.removeItem('UsuarioLogado');
    }
}
