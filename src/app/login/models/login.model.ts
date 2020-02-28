export class Login{
    constructor(
      public username: string,
      public password: string,
      public grant_type: string = 'password'
    ){}
  }
