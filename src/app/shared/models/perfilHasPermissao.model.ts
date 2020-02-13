import { Perfil } from './perfil.model'
import { Permissao } from './permissao.model'

export interface PerfilHasPermissao {
  id: number
  perfil: Perfil
  permissao: Permissao
  status: number
}
