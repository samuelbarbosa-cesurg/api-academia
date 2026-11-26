// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";

// Retorna todos os alunos ordenados pelo id.
export async function listarAlunos() {
  const { rows } = await db.query(`
    SELECT * FROM alunos
    ORDER BY id
  `);

  return rows;
}