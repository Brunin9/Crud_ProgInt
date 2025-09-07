// Importação das dependências necessárias
const express = require('express');    //framework web pra Node.js
const fs = require('fs');              //sistema de arquivos para ler/escrever JSON
const path = require('path');          //utilitário para trabalhar com caminhos de arquivos

//criação do Express e definição da porta
const app = express();
const PORT = 3000;

//middleware para interpretar requisições JSON
//deixa o servidor entender dados enviados no formato JSON
app.use(express.json());

//middleware para servir arquivos estáticos da pasta 'public'
//isso deixa o navegador acesse HTML, CSS, JS e imagens
app.use(express.static('public'));

//define o caminho do arquivo JSON que servirá como um bd
const arquivo = './alunos.json';

//função para ler os dados do arquivo JSON
//converte o texto JSON em um array de objetos JavaScript
const ler = () => JSON.parse(fs.readFileSync(arquivo));

//função para salvar dados no arquivo JSON
//converte o array JavaScript em texto JSON formatado e salva
const salvar = (dados) => fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));

//GET - Listar todos os alunos
//Rota: GET /api/alunos
app.get('/api/alunos', (req, res) => {
    //le o arquivo JSON e retorna todos os alunos
    res.json(ler());
});

//GET - Buscar um aluno específico por ID
//Rota: GET /api/alunos/:id (onde :id é um parâmetro dinâmico)
app.get('/api/alunos/:id', (req, res) => {
    const alunos = ler();                               //carrega todos os alunos
    const aluno = alunos.find(a => a.id == req.params.id);  //busca pelo ID
    res.json(aluno);                                    //retorna o aluno encontrado
});

//POST - Criar um novo aluno
//Rota: POST /api/alunos
app.post('/api/alunos', (req, res) => {
    const alunos = ler();                               //carrega alunos existentes
    
    //cria um novo aluno com ID único (timestamp) + dados do corpo da requisição
    const novo = { 
        id: Date.now(),        //ID único usando o timestamp atual
        ...req.body            //copia todos os campos do body
    };
    
    alunos.push(novo); //adiciona o novo aluno ao array
    salvar(alunos); //salva no arquivo JSON
    res.json(novo); //retorna o aluno criado
});

//PUT - Atualizar um aluno existente
//Rota: PUT /api/alunos/:id
app.put('/api/alunos/:id', (req, res) => {
    const alunos = ler();                               //carrega todos os alunos
    const index = alunos.findIndex(a => a.id == req.params.id);  //encontra o índice do aluno
    
    //atualiza o aluno na posição encontrada
    alunos[index] = { 
        id: parseInt(req.params.id),  //mantém o ID original (convertido para número)
        ...req.body                   //atualiza com os novos dados
    };
    
    salvar(alunos);                                     //salva as alterações
    res.json(alunos[index]);                           //retorna o aluno atualizado
});

//DELETE - Remover um aluno
//Rota: DELETE /api/alunos/:id
app.delete('/api/alunos/:id', (req, res) => {
    let alunos = ler();                                 //carrega todos os alunos
    
    //filtra o array removendo o aluno com o ID especificado
    alunos = alunos.filter(a => a.id != req.params.id);
    
    salvar(alunos);                                     //salva o array sem o aluno removido
    res.json({ ok: true });                            //confirma que a operação foi bem-sucedida
});

//inicia o servidor na porta especificada
app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));
