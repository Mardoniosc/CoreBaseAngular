import { Component } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Core Base Angular';

  constructor( private router: Router ){}

  sair(){
    delete localStorage['userToken']
    this.router.navigate(['/'])
  }

  autenticado(){
    return localStorage['userToken']
  }
}
