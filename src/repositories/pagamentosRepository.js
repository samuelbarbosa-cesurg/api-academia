// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";
import { traduzirErroDoBanco } from "../models/erroBanco.js";

// Retorna todos os pagamentos ordenados pelo id.
export async function listarPagamentos() {
  const { rows } = await db.query(`
    SELECT * FROM pagamentos
    ORDER BY id
  `);

  return rows;
}

export async function buscarPagamentoPorId(id) {
  const { rows } = await db.query(`
    SELECT * FROM pagamentos
    WHERE id = $1
  `, [id]);

  return rows[0];
}

export async function pagarPagamento(id) {
  try {
    const { rows } = await db.query(`
      UPDATE pagamentos
      SET status = 'pago', pago_em = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date
      WHERE id = $1
      RETURNING *
    `, [id]);

    return rows[0];
  } catch (error) {
    traduzirErroDoBanco(error);
  }
}
