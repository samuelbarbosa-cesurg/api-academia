export class ErroBanco extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.name = 'ErroBanco'
    this.status = status
  }
}

// Transforma um erro do PostgreSQL (Supabase) em um ErroBanco com o status HTTP.
export function traduzirErroDoBanco(erro) {
  const status = {
    "23505": 409, // valor repetido em campo UNIQUE
    "23P01": 409, // conflito com uma restrição de exclusão
    "23503": 409, // chave estrangeira
    "23514": 400, // regra CHECK
    "23502": 400, // campo obrigatório vazio
  }[erro.code];

  if (!status) throw erro; // erro inesperado: vira 500

  throw new ErroBanco(
    `O banco recusou a operação.`,
    status,
  );
}
