import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment as env } from 'src/environments/environment'
import { httpOptions } from '../headers.api.config'
import { Usuario } from '../models';

@Injectable()
export class UsuariosService {

  private readonly PATH: string = '/usuarios'

  constructor(
    private http: HttpClient,
  ) { }

  getAllUsers(): Observable<any>{
    return this.http.get(env.baseURL_API + this.PATH);
  }

  getUserId(id): Observable<any>{
    return this.http.get(env.baseURL_API + this.PATH + '/' + id)
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(env.baseURL_API + this.PATH + '/' + id)
  }

  createUser(usuario: Usuario): Observable<any>{
    return this.http.post(env.baseURL_API + this.PATH, usuario)
  }

  updateUser(usuario: Usuario, id): Observable<any> {
    return this.http.put(env.baseURL_API + this.PATH + '/' + id, usuario)
  }
}
