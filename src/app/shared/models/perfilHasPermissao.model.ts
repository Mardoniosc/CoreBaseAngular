import { Perfil } from './perfil.model'
import { Permissao } from './permissao.model'

export interface PerfilHasPermissao {
  id: number
  perfil_id: Perfil
  permissao_id: Permissao
  status: number
}
