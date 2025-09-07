import express from "express";

const router = express.Router();

// Lista em memória (pode ser substituída por banco depois)
let alunos = [];

// 📍 GET - listar todos os alunos
router.get("/", (req, res) => {
  res.json(alunos);
});

// 📍 POST - cadastrar novo aluno
router.post("/", (req, res) => {
  const { nome, cpf, telefone, email, matricula } = req.body;

  if (!nome || !cpf || !telefone || !email || !matricula) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  const novoAluno = {
    id: Date.now(), // gera id simples
    nome,
    cpf,
    telefone,
    email,
    matricula,
  };

  alunos.push(novoAluno);

  res.status(201).json(novoAluno); // 👈 devolve o aluno criado
});

// 📍 PUT - editar aluno
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, cpf, telefone, email, matricula } = req.body;

  const index = alunos.findIndex((a) => a.id == id);
  if (index === -1) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }

  alunos[index] = { id: Number(id), nome, cpf, telefone, email, matricula };

  res.json(alunos[index]);
});

// 📍 DELETE - excluir aluno
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const index = alunos.findIndex((a) => a.id == id);
  if (index === -1) {
    return res.status(404).json({ erro: "Aluno não encontrado" });
  }

  const removido = alunos.splice(index, 1);

  res.json(removido[0]);
});

export default router;
