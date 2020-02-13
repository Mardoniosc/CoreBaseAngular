import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { environment as env } from 'src/environments/environment'
import { Perfil } from '../models';

@Injectable()
export class PerfilService {

  private readonly PATH: string = '/perfils'

  constructor(
    private http: HttpClient
  ) { }

  getAllPerfils(): Observable<any>{
    return this.http.get(env.baseURL_API + this.PATH);
  }

  getPerfilId(id): Observable<any>{
    return this.http.get(env.baseURL_API + this.PATH + '/' + id)
  }

  deletePerfil(id): Observable<any> {
    return this.http.delete(env.baseURL_API + this.PATH + '/' + id)
  }

  createPerfil(perfil: Perfil): Observable<any>{
    return this.http.post(env.baseURL_API + this.PATH, perfil)
  }

  updatePerfil(perfil: Perfil, id): Observable<any> {
    return this.http.put(env.baseURL_API + this.PATH + '/' + id, perfil)
  }
}
