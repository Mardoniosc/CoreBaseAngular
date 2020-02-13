import { Usuario } from './usuario.model';

export interface HistoricoAcesso {
  id: number
  data_acesso: Date
  usuario: Usuario
}
