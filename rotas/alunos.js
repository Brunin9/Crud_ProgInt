import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.join("dados", "alunos.json");

// Funções auxiliares
const lerAlunos = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const salvarAlunos = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// GET -> Listar todos os alunos
router.get("/", (req, res) => {
    const alunos = lerAlunos();
    res.json(alunos);
});

// POST -> Inserir novo aluno
router.post("/", (req, res) => {
    const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
    const alunos = lerAlunos();
    const novoAluno = { id: Date.now(), nome, cpf, telefone, email, matricula, aluno, escola };
    alunos.push(novoAluno);
    salvarAlunos(alunos);
    res.status(201).json(novoAluno);
});

// PUT -> Editar aluno
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
    const alunos = lerAlunos();
    const index = alunos.findIndex(a => a.id == id);

    if (index === -1) return res.status(404).json({ error: "Aluno não encontrado" });

    alunos[index] = { id: Number(id), nome, cpf, telefone, email, matricula, aluno, escola };
    salvarAlunos(alunos);
    res.json(alunos[index]);
});

// DELETE -> Remover aluno
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    let alunos = lerAlunos();
    alunos = alunos.filter(a => a.id != id);
    salvarAlunos(alunos);
    res.json({ message: "Aluno removido" });
});

export default router;
