// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";
import { traduzirErroDoBanco } from "../models/erroBanco.js";

// Retorna todos os alunos ordenados pelo id.
export async function listarAlunos() {
  const { rows } = await db.query(`
    SELECT * FROM alunos
    ORDER BY id
  `);

  return rows;
}

export async function listarAlunoPorId(id) {
  const { rows } = await db.query(`
    SELECT * FROM alunos
    WHERE id = $1
  `, [id]);

  return rows[0];
}

export async function buscarAlunoPorEmail(email) {
  const { rows } = await db.query(`
    SELECT * FROM alunos
    WHERE email = $1
  `, [email]);

  return rows[0];
}

export async function buscarAlunoPorCpf(cpf) {
  const { rows } = await db.query(`
    SELECT * FROM alunos
    WHERE cpf = $1
  `, [cpf]);

  return rows[0];
}

export async function existePlano(planoId) {
  const { rows } = await db.query(`
    SELECT 1 FROM planos
    WHERE id = $1
  `, [planoId]);

  return rows.length > 0;
}

// Insere o aluno e retorna o registro criado, já com o id.
export async function cadastrarAluno(aluno) {
  try {
    const { rows } = await db.query(`
      INSERT INTO alunos
        (nome, cpf, email, data_nascimento, plano_id, inicio_plano, ativo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      aluno.nome,
      aluno.cpf,
      aluno.email,
      aluno.data_nascimento,
      aluno.plano_id,
      aluno.inicio_plano,
      aluno.ativo,
    ]);

    return rows[0];
  } catch (error) {
    traduzirErroDoBanco(error);
  }
}

export async function atualizarAluno(id, aluno) {
  try {
    const { rows } = await db.query(`
      UPDATE alunos
      SET nome = $1, cpf = $2, email = $3, data_nascimento = $4, plano_id = $5, inicio_plano = $6, ativo = $7
      WHERE id = $8
      RETURNING *
    `, [
      aluno.nome,
      aluno.cpf,
      aluno.email,
      aluno.data_nascimento,
      aluno.plano_id,
      aluno.inicio_plano,
      aluno.ativo,
      id
    ]);

    return rows[0];
  } catch (error) {
    traduzirErroDoBanco(error);
  }
}
