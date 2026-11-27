import { ErroValidacao } from "./erroValidacao.js";

export class Inscricao {
  constructor({ turma_id, aluno_id }) {
    if (!Number.isInteger(turma_id) || turma_id <= 0) {
      throw new ErroValidacao("Informe uma turma válida");
    }
    if (!Number.isInteger(aluno_id) || aluno_id <= 0) {
      throw new ErroValidacao("Informe um ID de aluno válido");
    }

    this.turma_id = turma_id;
    this.aluno_id = aluno_id;
  }
}
