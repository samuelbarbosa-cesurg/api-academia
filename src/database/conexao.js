// Abre a conexão com o banco PostgreSQL do Supabase.
// A URL de conexão vem da variável DATABASE_URL, definida no .env.
import pg from "pg";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("Defina a variável DATABASE_URL no arquivo .env");
}

const db = new pg.Pool({
  connectionString: DATABASE_URL,
  // O Supabase usa conexão criptografada com certificado próprio.
  ssl: { rejectUnauthorized: false },
});

// Evita que a API caia se uma conexão parada no pool for encerrada.
db.on("error", (erro) => {
  console.error("Erro na conexão com o banco:", erro.message);
});

export default db;
