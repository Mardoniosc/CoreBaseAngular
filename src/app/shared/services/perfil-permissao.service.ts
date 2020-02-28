import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { environment as env } from '../../../environments/environment'
import { PerfilHasPermissao } from '../models';

@Injectable()
export class PerfilPermissaoService {

  private readonly PATH: string = '/perfil-permissoes'

  constructor(
    private http: HttpClient
  ) { }

  getAllPerfilPermissao(): Observable<any>{
    return this.http.get(env.baseURL_API + this.PATH);
  }

  getPerfilPermissaoId(id): Observable<any>{
    return this.http.get(env.baseURL_API + this.PATH + '/' + id)
  }

  deletePerfilPermissao(id): Observable<any> {
    return this.http.delete(env.baseURL_API + this.PATH + '/' + id)
  }

  createPerfilPermissao(PerfilHasPermissao: PerfilHasPermissao): Observable<any>{
    return this.http.post(env.baseURL_API + this.PATH, PerfilHasPermissao)
  }

  updatePerfilPermissao(PerfilHasPermissao: PerfilHasPermissao, id): Observable<any> {
    return this.http.put(env.baseURL_API + this.PATH + '/' + id, PerfilHasPermissao)
  }
}

