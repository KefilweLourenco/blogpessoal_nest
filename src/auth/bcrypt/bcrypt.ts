import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
 
@Injectable()
export class Bcrypt{

    async criptografarSenha(senha: string): Promise<string>{

        let saltos: number = 10;
        return await bcrypt.hash(senha, saltos);

    }

    async compararSenhas(senhaDigitada: string, senhabanco: string): Promise<boolean>{
        return await bcrypt.compare(senhaDigitada, senhabanco);
    }

}