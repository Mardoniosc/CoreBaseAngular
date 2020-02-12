export class Usuario {
  constructor(
  public id: number,
  public cpf: string,
  public criado: Date,
  public email: string,
  public imagem: string,
  public login: string,
  public nome: string,
  public senha: string,
  public status: number,
  public perfil_id: number
  ){

  }

}
