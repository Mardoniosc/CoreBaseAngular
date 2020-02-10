import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment as env } from '../../../../environments/environment'
import { Login } from '../models'

@Injectable()
export class LoginService {

  private readonly PATH: string = '/token'

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  logar(login: Login): Observable<any> {
    return this.http.post(env.baseURL + this.PATH,
        JSON.stringify(login),
        this.httpOptions)
  }
}
