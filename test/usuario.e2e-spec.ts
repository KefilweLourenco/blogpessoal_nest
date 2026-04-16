import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
 
describe('Testes dos Módulos Usuário e Auth (e2e)', () => {  // descrição do teste e2e
  let token: string; 
  let usuarioid: any;
  let app: INestApplication; // declara a variável app do tipo INestApplication
 
  beforeAll(async () => {  // configurações iniciais do teste que serão executadas antes de todos os testes uma vez so no inicio.
    const moduleFixture: TestingModule = await Test.createTestingModule({ // cria o modulo de teste nest e configura as dependências do modulo
      imports: [
        TypeOrmModule.forRoot({ // configuração do typeorm com o banco em memoria
          type: "sqlite",  // tipo de banco
          database: ":memory:", // banco em memoria, sera apagado ao final do teste
          entities: [__dirname + "/../src/**/entities/*.entity.ts"], // caminho dos arquivos de entidades
          synchronize: true, // sincroniza as entidades com o banco
          dropSchema: true // apaga o banco ao final do teste
        }),
        AppModule], // importa o modulo principal para que as dependências sejam resolvidas
    }).compile(); // compila o modulo
 
    app = moduleFixture.createNestApplication();  // cria a aplicação nest
    app.useGlobalPipes(new ValidationPipe()); // configuração de validação de dados de entrada
    await app.init(); // inicializa a aplicação nest e configuração da porta do servidor que é a porta 4000
  });
 
  // testes
  it("01 - Deve criar um novo usuário", async () => {// testa se o usuário pode ser criado)
    const resposta = await request(app.getHttpServer())
    .post('/usuarios/cadastrar')
    .send({ // envia uma requisição post para a rota /usuarios/cadastrar com o corpo da requisição sendo o usuário)
        nome: "capivara",
        usuario: "capivara@gmail.com",
        senha: "12345678",
        foto: "-"
    })
    .expect(201); // espera uma resposta com o status code 201
    usuarioid = resposta.body.id; // Guarda o id do usuário criado para usar no teste de atualização
  });

  it("02 - Não Deve Cadastrar um Usuario Duplicado", async() =>{ //  // Tenta cadastrar outro usuário com o mesmo e-mail do teste 01
    return await request(app.getHttpServer())
    .post('/usuarios/cadastrar')
    .send({
        nome: "capivara",
        usuario: "capivara@gmail.com",
        senha: "12348765",
        foto: "-",
    })
    .expect(400) // espera erro (bad request) porque o usuário já existe
  });

  it("03 - Deve Autenticar o Usuário (Login)", async () => { // Faz login com o usuário criado no teste 01
    const resposta = await request(app.getHttpServer())
    .post("/usuarios/logar")
    .send({
      usuario: "capivara@gmail.com",
      senha: "12345678",
    })
    .expect(200); // espera login bem sucedido

    token = resposta.body.token; // Guarda o token retornado pelo login
  });

  it("04 - Deve Listar todos os Usuários", async () => { // Faz uma requisição GET para listar usuários
    return await request(app.getHttpServer())
    .get("/usuarios/all")
    .set("Authorization", token) // envia o token no cabeçalho da requisição
    .expect(200); // espera sucesso na listagem
  });

  it("05 - Deve Atualizar um Usúario", async () => { // Atualiza o usuário criado no teste 01
    return await request(app.getHttpServer())
    .put('/usuarios/atualizar')
    .set('Authorization', token) // envia o token para acessar a rota protegida
    .send({
      id: usuarioid, // usa o id salvo no teste 01
      nome: "Geandro Capivara",
      usuario: "capivara@gmail.com",
      senha: "12345678",
      foto: '-',
    })
    .expect(200) // espera que a atualização seja feita com sucesso
    .then( resposta => { // Confere se o nome retornado foi realmente atualizado
      expect("Geandro Capivara").toEqual(resposta.body.nome);
    })

  })
 
  afterAll(async () => { // Fecha a aplicação Nest depois que todos os testes terminarem
    await app.close();
  });
  
});
 
