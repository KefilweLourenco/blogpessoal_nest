import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Postagem } from "../entities/postagem.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable() // Decorador para indicar que essa classe é um serviço
export class PostagemService {
    temaService: any;

    constructor(
        @InjectRepository(Postagem) // Injeção de dependência, recebe o repositório de postagem
        private postagemRepository: Repository<Postagem> // Injeção de dependência
    ){}

    async findAll(): Promise<Postagem[]>{ // Promise é uma função assíncrona 
       return await this.postagemRepository.find(); // select * from tb_postagem;
    }   
    async findById(id: number): Promise<Postagem>{

        const postagem = await this.postagemRepository.findOne({
            where: {
                id
            }

        });

            if (!postagem)
                throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);
            
            return postagem;
            }
    async findAllByTitulo(titulo: string): Promise<Postagem[]>{
        return await this,this.postagemRepository.find({
            where:{
                titulo: ILike(`%${titulo}%`)
            }
        })
    }
           
    async create(postagem: Postagem): Promise<Postagem> {
        return await this.postagemRepository.save(postagem);
    }      

    async update(postagem: Postagem): Promise<Postagem> {
        await this.findById(postagem.id);

        await this.postagemRepository.save(postagem);

        return await this.findById(postagem.id);
}
    
    async delete(id: number) : Promise<DeleteResult>{

        await this.findById(id);

        return await this.postagemRepository.delete(id);

    }
}




