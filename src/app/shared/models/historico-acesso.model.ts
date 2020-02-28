import { Usuario } from './usuario.model';

export class HistoricoAcesso {
  id: number
  data_acesso: Date
  usuario: Usuario
}
