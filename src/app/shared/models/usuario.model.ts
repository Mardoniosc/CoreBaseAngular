import { Perfil } from './perfil.model'
import { HistoricoAcesso } from './historico-acesso.model'

export class Usuario {
    cpf: string
    criado: Date
    email: string
    login: string
    nome: string
    senha: string
    imagem?: string
    status?: number
    id?: number
    historicoAcessos?: HistoricoAcesso[]
    perfil?: Perfil

}
