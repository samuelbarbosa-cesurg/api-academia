// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";


export async function listarTurmas() {
  const { rows } = await db.query(`
    SELECT * FROM turmas
    ORDER BY id
  `);

  return rows;
}
