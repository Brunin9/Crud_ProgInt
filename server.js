const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const arquivo = './alunos.json';

// Criar arquivo se não existir
if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(arquivo, '[]');
}

const ler = () => JSON.parse(fs.readFileSync(arquivo));
const salvar = (dados) => fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));

// Listar todos
app.get('/api/alunos', (req, res) => {
    res.json(ler());
});

// Buscar um
app.get('/api/alunos/:id', (req, res) => {
    const alunos = ler();
    const aluno = alunos.find(a => a.id == req.params.id);
    res.json(aluno);
});

// Criar
app.post('/api/alunos', (req, res) => {
    const alunos = ler();
    const novo = { id: Date.now(), ...req.body };
    alunos.push(novo);
    salvar(alunos);
    res.json(novo);
});

// Atualizar
app.put('/api/alunos/:id', (req, res) => {
    const alunos = ler();
    const index = alunos.findIndex(a => a.id == req.params.id);
    alunos[index] = { id: parseInt(req.params.id), ...req.body };
    salvar(alunos);
    res.json(alunos[index]);
});

// Deletar
app.delete('/api/alunos/:id', (req, res) => {
    let alunos = ler();
    alunos = alunos.filter(a => a.id != req.params.id);
    salvar(alunos);
    res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));