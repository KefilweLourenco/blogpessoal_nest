import { PostagemService } from "../services/postagem.service";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put } from "@nestjs/common";
import { Postagem } from "../entities/postagem.entity";

@Controller("/postagens")
export class PostagemController {
    constructor(private readonly postagemService: PostagemService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Postagem[]> {
        return this.postagemService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() postagem: Postagem): Promise<Postagem> {
        return this.postagemService.create(postagem);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() postagem: Postagem): Promise<Postagem> {
        return this.postagemService.update(postagem);
}
}