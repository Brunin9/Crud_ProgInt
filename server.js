import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import alunosRoutes from "./rotas/alunos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware para receber JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware personalizado
import logger from "./middleware/logger.js";
app.use(logger);

// Rotas da API
app.use("/api/alunos", alunosRoutes);

// Servir arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
