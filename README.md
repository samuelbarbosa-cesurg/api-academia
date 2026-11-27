## Integrantes
- Matheus Silvestri
- Samuel Barbosa
- Vitor Hugo

## Tema
API Academia

## Rotas

| Método | Rota | O que faz |
|---|---|---|
| GET | `/alunos` | Lista os alunos |
| GET | `/alunos/:id` | Busca um aluno |
| POST | `/alunos` | Cadastra um aluno |
| PATCH | `/alunos/:id` | Altera nome, CPF, e-mail ou `ativo` |
| DELETE | `/alunos/:id` | Exclui um aluno |
| GET | `/planos` | Lista os planos |
| GET | `/turmas` | Lista as turmas |
| POST | `/turmas/:id/inscricoes` | Inscreve um aluno na turma |
| DELETE | `/turmas/:id/inscricoes/:alunoId` | Cancela a inscrição |
| GET | `/pagamentos` | Lista os pagamentos |
| PATCH | `/pagamentos/:id/pagar` | Marca o pagamento como pago |

## Testes

O **cadastro base**, usado nos testes de `POST /alunos`, é:

```json
{
  "nome": "Aluno Teste",
  "cpf": "12345678901",
  "email": "aluno.teste@email.com",
  "data_nascimento": "2000-01-15",
  "plano_id": 1,
  "inicio_plano": "2026-11-01"
}
```
### Alunos

| # | Restrição ou regra | Requisição | Corpo | Status | Mensagem ou resultado esperado |
|---|---|---|---|---|---|
| 1 | E-mail não se repete | `POST /alunos` | base com `{"email":"rafael.silva@email.com"}` | 409 | Já existe um aluno cadastrado com este e-mail |
| 2 | CPF não se repete | `POST /alunos` | base com `{"cpf":"91141707536"}` | 409 | Já existe um aluno cadastrado com este CPF |
| 3 | E-mail não se repete na alteração | `PATCH /alunos/1` | `{"email":"rafael.silva@email.com"}` | 409 | Já existe um aluno cadastrado com este e-mail |
| 4 | CPF não se repete na alteração | `PATCH /alunos/1` | `{"cpf":"91141707536"}` | 409 | Já existe um aluno cadastrado com este CPF |
| 5 | Nome obrigatório | `POST /alunos` | base com `{"nome":""}` | 400 | O nome deve ter pelo menos 2 caracteres |
| 6 | CPF com 11 números | `POST /alunos` | base com `{"cpf":"123.456.789"}` | 400 | O CPF deve ter 11 números, sem pontos e traço |
| 7 | E-mail obrigatório e válido | `POST /alunos` | base com `{"email":"abc"}` | 400 | Informe um email válido |
| 8 | Data de nascimento válida | `POST /alunos` | base com `{"data_nascimento":"2000-02-30"}` | 400 | Informe a data de nascimento no formato AAAA-MM-DD |
| 9 | Plano obrigatório | `POST /alunos` | base com `{"plano_id":null}` | 400 | Informe um plano válido |
| 10 | Plano precisa existir | `POST /alunos` | base com `{"plano_id":999}` | 400 | O plano informado em plano_id não existe |
| 11 | Início do plano obrigatório | `POST /alunos` | base com `{"inicio_plano":null}` | 400 | Informe a data de início do plano no formato AAAA-MM-DD |
| 12 | `ativo` é verdadeiro ou falso | `PATCH /alunos/2` | `{"ativo":"sim"}` | 400 | O campo ativo deve ser true ou false |
| 13 | Própria: e-mail em minúsculas | `POST /alunos` | base com `{"email":"ALUNO.TESTE@EMAIL.COM"}` | 201 | Retorna o aluno com o e-mail `aluno.teste@email.com` |
| 14 | Aluno com inscrições ou pagamentos não é excluído | `DELETE /alunos/1` | sem corpo | 409 | O banco recusou a operação. |

### Inscrições

| # | Restrição ou regra | Requisição | Corpo | Status | Mensagem ou resultado esperado |
|---|---|---|---|---|---|
| 15 | Só a API: turma lotada | `POST /turmas/1/inscricoes` | `{"alunoId":2}` | 409 | A turma não tem vagas disponíveis |
| 16 | Só a API: aluno inativo | `POST /turmas/2/inscricoes` | `{"alunoId":10}` | 409 | Aluno inativo não pode ser inscrito |
| 17 | Aluno não se repete na turma | `POST /turmas/6/inscricoes` | `{"alunoId":2}` | 409 | O aluno já está inscrito nesta turma |
| 18 | Turma precisa existir | `POST /turmas/999/inscricoes` | `{"alunoId":2}` | 404 | Turma não encontrada |
| 19 | Aluno precisa existir | `POST /turmas/2/inscricoes` | `{"alunoId":999}` | 404 | Aluno não encontrado |
| 20 | Aluno obrigatório | `POST /turmas/2/inscricoes` | `{}` | 400 | Informe um ID de aluno válido |
| 21 | Inscrição válida | `POST /turmas/2/inscricoes` | `{"alunoId":2}` | 201 | Retorna a inscrição criada |
| 22 | Cancelamento válido | `DELETE /turmas/2/inscricoes/2` | sem corpo | 200 | Inscrição cancelada com sucesso |
| 23 | Cancelar inscrição que não existe | `DELETE /turmas/2/inscricoes/2` | sem corpo | 404 | Inscrição não encontrada |

### Pagamentos

| # | Restrição ou regra | Requisição | Corpo | Status | Mensagem ou resultado esperado |
|---|---|---|---|---|---|
| 24 | `pago_em` preenchido quando está pago | `PATCH /pagamentos/2/pagar` | sem corpo | 200 | Retorna `status` igual a `pago` e `pago_em` com a data de hoje |
| 25 | Pagamento não é pago duas vezes | `PATCH /pagamentos/2/pagar` | sem corpo | 409 | Este pagamento já está pago |
| 26 | Pagamento precisa existir | `PATCH /pagamentos/999/pagar` | sem corpo | 404 | Pagamento não encontrado |