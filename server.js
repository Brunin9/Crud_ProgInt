import express from "express";
import bodyParser from "body-parser";
import alunosRoutes from "./rotas/alunos.js";
import logMiddleware from "./middleware/log.js";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(logMiddleware);

app.use("/alunos", alunosRoutes);

app.use(express.static("Public"));

app.listen(PORT, () => {
  console.log(`Rodando em http://localhost:${PORT}`);
});
