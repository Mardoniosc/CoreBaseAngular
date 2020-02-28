import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment as env } from '../../../environments/environment'

@Injectable()
export class LoginService {

  private readonly PATH: string = '/token'

  constructor(
    private http: HttpClient
  ) { }


  /**
   *
   * @param login Login do WSO2
   * @param httpOptions
   */
  logarWSO2(login, httpOptions): Observable<any> {
    let grant_type = 'password';
    let username = login.username;
    let password = login.password;
    let body = `grant_type=${grant_type}&username=${username}&password=${password}`;
    return this.http.post(env.baseURL + this.PATH,
        body,
        httpOptions)
  }
}
