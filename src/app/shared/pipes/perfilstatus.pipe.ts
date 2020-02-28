import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'perfilstatus'
})
export class PerfilstatusPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return this.obterTexto(value);
    }

    obterTexto(value): string {
        let status: string
        switch(value){
            case 1:
                status = "Ativado"
                break
            case 0:
                status = "Desativado"
                break
            default:
                status = "Em espera"
                break
        }

        return status;
    }

}
