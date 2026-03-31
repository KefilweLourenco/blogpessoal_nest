import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Postagem } from "../entities/postagem.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable() // Decorador para indicar que essa classe é um serviço
export class PostagemService {

    constructor(
        @InjectRepository(Postagem) // Injeção de dependência, recebe o repositório de postagem
        private postagemRepository: Repository<Postagem> // Injeção de dependência
    ){}

    async findAll(): Promise<Postagem[]>{ // Promise é uma função assíncrona 
       return await this.postagemRepository.find(); // select * from tb_postagem;
    }   


}
