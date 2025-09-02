import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const arquivo = path.resolve("Dados/alunos.json");

function lerDados() {
  if (!fs.existsSync(arquivo)) return [];
  const data = fs.readFileSync(arquivo);
  return JSON.parse(data);
}

function salvarDados(dados) {
  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
}

router.post("/", (req, res) => {
  const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
  const dados = lerDados();

  const novo = { id: Date.now(), nome, cpf, telefone, email, matricula, aluno, escola };
  dados.push(novo);
  salvarDados(dados);

  res.status(201).json(novo);
});

router.get("/", (req, res) => {
  res.json(lerDados());
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const dados = lerDados();
  const index = dados.findIndex(a => a.id == id);

  if (index === -1) return res.status(404).json({ erro: "Aluno não encontrado" });

  dados[index] = { ...dados[index], ...req.body };
  salvarDados(dados);

  res.json(dados[index]);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let dados = lerDados();
  dados = dados.filter(a => a.id != id);
  salvarDados(dados);

  res.json({ mensagem: "Aluno removido" });
});

export default router;
