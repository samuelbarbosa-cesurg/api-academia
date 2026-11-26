import express from "express";
import { fileURLToPath } from "node:url";
import * as alunosController from "./controllers/alunosController.js";
import * as planosController from "./controllers/planosController.js";
import * as turmasController from "./controllers/turmasController.js";


if (!process.env.JWT_SECRET) {
  console.error("Falta o JWT_SECRET no arquivo .env");
  process.exit(1);
}

const app = express();
app.use("/app", express.static("public"));

const PORTA = Number(process.env.PORT || 3000);



app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PATCH,DELETE");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (request.method === "OPTIONS") return response.sendStatus(204);
  next();
});
app.use(express.json());

app.get("/turmas", turmasController.listarTurmas);
app.get("/planos", planosController.listarPlanos);
app.get("/alunos", alunosController.listarAlunos);
app.get("/alunos/:id", alunosController.listarAlunoPorId);
app.post("/alunos", alunosController.cadastrarAluno);


app.use((req, res, next) => {
  res.status(404).json({
    erro: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORTA, () => {
    console.log(`API disponível em http://localhost:${PORTA}`);
  });
}

export default app;