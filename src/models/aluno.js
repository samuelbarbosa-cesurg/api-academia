import { ErroValidacao } from "./erroValidacao.js";

export class Aluno {
  constructor({ nome, cpf, email, data_nascimento, plano_id, inicio_plano, ativo = true }) {
    if (typeof nome !== "string" || nome.trim().length < 2 || nome.trim().length > 100) {
      throw new ErroValidacao("O nome deve ter entre 2 e 100 caracteres");
    }
    if (typeof cpf !== "string" || cpf.trim().length !== 11 || !somenteNumeros(cpf.trim())) {
      throw new ErroValidacao("O CPF deve ter 11 números, sem pontos e traço");
    }
    if (typeof email !== "string" || !email.includes("@")) {
      throw new ErroValidacao("Informe um email válido");
    }
    if (!dataValida(data_nascimento)) {
      throw new ErroValidacao("Informe a data de nascimento no formato AAAA-MM-DD");
    }
    if (!Number.isInteger(plano_id) || plano_id <= 0) {
      throw new ErroValidacao("Informe um plano válido");
    }
    if (!dataValida(inicio_plano)) {
      throw new ErroValidacao("Informe a data de início do plano no formato AAAA-MM-DD");
    }
    if (typeof ativo !== "boolean") {
      throw new ErroValidacao("O campo ativo deve ser true ou false");
    }

    this.nome = nome.trim();
    this.cpf = cpf.trim();
    this.email = email.trim().toLowerCase();
    this.data_nascimento = data_nascimento;
    this.plano_id = plano_id;
    this.inicio_plano = inicio_plano;
    this.ativo = ativo;
  }
}


// Confere se todos os caracteres são números.
function somenteNumeros(texto) {
  for (const caractere of texto) {
    if (!"0123456789".includes(caractere)) {
      return false;
    }
  }
  return true;
}

// Confere se o texto é uma data que existe, no formato AAAA-MM-DD.
function dataValida(texto) {
  if (typeof texto !== "string" || texto.length !== 10) {
    return false;
  }
  const data = new Date(`${texto}T00:00:00Z`);
  if (Number.isNaN(data.getTime())) {
    return false;
  }
  // Datas como 30/02 podem virar outro dia, então compara com o texto original.
  return data.toISOString().slice(0, 10) === texto;
}
