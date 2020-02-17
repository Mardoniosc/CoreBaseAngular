import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  usuario = {} as Usuario


  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('UsuarioLogado'))
  }


}
