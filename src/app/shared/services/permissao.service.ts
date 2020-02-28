import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment'
import { Permissao } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {

  private readonly PATH: string = '/permissoes'

  constructor(
    private http: HttpClient,
  ) { }

  getAllPermissao(): Observable<any>{
    return this.http.get(env.baseURL_API + this.PATH);
  }

  getPermissaoId(id): Observable<any>{
    return this.http.get(env.baseURL_API + this.PATH + '/' + id)
  }

  deletePermissao(id): Observable<any> {
    return this.http.delete(env.baseURL_API + this.PATH + '/' + id)
  }

  createPermissao(permissao: Permissao): Observable<any>{
    return this.http.post(env.baseURL_API + this.PATH, permissao)
  }

  updatePermissao(permissao: Permissao, id): Observable<any> {
    return this.http.put(env.baseURL_API + this.PATH + '/' + id, permissao)
  }
}
