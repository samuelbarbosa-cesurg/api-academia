import { ErroValidacao } from "./erroValidacao.js";

export class Aluno {
  constructor({ nome, cpf, email, data_nascimento, plano_id, inicio_plano }) {
    if (typeof nome !== "string" || nome.trim().length < 2) {
      throw new ErroValidacao("O nome deve ter pelo menos 2 caracteres");
    }
    if (typeof cpf !== "string" || cpf.trim().length !== 11) {
      throw new ErroValidacao("O CPF deve ter 11 números, sem pontos e traço");
    }
    if (typeof email !== "string" || !email.includes("@")) {
      throw new ErroValidacao("Informe um email válido");
    }
    if (typeof data_nascimento !== "string" || data_nascimento.length !== 10) {
      throw new ErroValidacao("Informe a data de nascimento no formato AAAA-MM-DD");
    }
    if (!Number.isInteger(plano_id) || plano_id <= 0) {
      throw new ErroValidacao("Informe um plano válido");
    }
    if (typeof inicio_plano !== "string" || inicio_plano.length !== 10) {
      throw new ErroValidacao("Informe a data de início do plano no formato AAAA-MM-DD");
    }

    this.nome = nome.trim();
    this.cpf = cpf.trim();
    this.email = email.trim().toLowerCase();
    this.data_nascimento = data_nascimento;
    this.plano_id = plano_id;
    this.inicio_plano = inicio_plano;
    this.ativo = true;
  }
}
