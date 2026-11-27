// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";
import { traduzirErroDoBanco } from "../models/erroBanco.js";


export async function listarTurmas() {
  const { rows } = await db.query(`
    SELECT * FROM turmas
    ORDER BY id
  `);

  return rows;
}

export async function buscarTurmaPorId(id) {
  const { rows } = await db.query(`
    SELECT * FROM turmas
    WHERE id = $1
  `, [id]);

  return rows[0];
}

export async function listarInscricoesPorTurma(turmaId) {
  const { rows } = await db.query(`
    SELECT * FROM inscricoes
    WHERE turma_id = $1
  `, [turmaId]);

  return rows;
}

export async function buscarInscricao(turmaId, alunoId) {
  const { rows } = await db.query(`
    SELECT * FROM inscricoes
    WHERE turma_id = $1 AND aluno_id = $2
  `, [turmaId, alunoId]);

  return rows[0];
}

// Insere o aluno na turma e retorna a inscrição criada
export async function inscreverAluno(inscricao) {
  try {
    const { rows } = await db.query(`
      INSERT INTO inscricoes
        (aluno_id, turma_id)
      VALUES ($1, $2)
      RETURNING *
    `, [
      inscricao.aluno_id,
      inscricao.turma_id,
    ]);

    return rows[0];
  } catch (error) {
    traduzirErroDoBanco(error);
  }
}
