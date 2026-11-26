// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";


export async function listarPlanos() {
  const { rows } = await db.query(`
    SELECT * FROM planos
    ORDER BY id
  `);

  return rows;
}
