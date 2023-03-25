# Talker Manager
O projeto consiste em uma API para gerenciar o cadastro, edição, visualização e exclusão de dados de um palestrante (talker).

## Tecnologias utilizadas
- JavaScript
- Expressjs
- fs
- Node
- Nodemon
- Mocha
- Chai
- Chai-http
- Sinon
- Docker
- Eslint

## Como executar o projeto
Faça o clone do repositório:
```sh
git clone https://github.com/LuizHenriquePy/talker-manager.git
```
Faça a instalação das bibliotecas necessárias:
```sh
npm install
```
Execute o docker compose:
```sh
docker-compose up -d
```
Acesse o terminal do container:
```sh
docker exec -it talker_manager bash
```
Faça a instalação das bibliotecas (caso seja necessário):
```sh
npm install
```
Execute o projeto:
```sh
npm run dev
```

## Como executar os testes
Execute o docker compose:
```sh
docker-compose up -d
```
Acesse o terminal do container:
```sh
docker exec -it talker-manager bash
```
Execute os testes:
```sh
npm test
```

## Arquivos desenvolvidos pela Trybe:
- docker-compose.yml
- talker.json
- seed.json
