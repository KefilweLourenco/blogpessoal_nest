import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postagem } from './postagem/entities/postagem.entity';
import { PostagemModule } from './postagem/postagem.modules';
import { Tema } from "./tema/entities/tema.entity"; 
import { TemaModule } from './tema/tema.module'; 
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { Usuario } from './usuario/entities/usuario.entity';
import { ConfigModule } from '@nestjs/config';
import { ProdService } from './data/services/prod.service';

@Module({  // configuração do modulo nest 
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
	  useClass: ProdService,
    imports: [ConfigModule],
}),
    PostagemModule, // importação do modulo postagem para ser utilizado no modulo nest
    TemaModule,
    AuthModule,
    UsuarioModule
  ],
  controllers: [AppController],  // configuração dos controladores
  providers: [AppService], // configuração dos providers 
})
export class AppModule {} // exportação do modulo nest

