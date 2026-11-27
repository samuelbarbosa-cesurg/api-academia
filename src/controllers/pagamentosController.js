import * as pagamentosLogic from "../logic/pagamentosLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";
import { ErroConflito } from "../models/erroConflito.js";
import { ErroBanco } from "../models/erroBanco.js";

export async function listarPagamentos(request, response) {
  try {
    const pagamentos = await pagamentosLogic.listarPagamentos();

    if (pagamentos.length === 0) {
      return response.status(404).json({ erro: "Nenhum pagamento encontrado" });
    }

    return response.status(200).json(pagamentos);
  } catch (error) {
    console.error(`Erro ao listar pagamentos: ${error.message}`);
    return response.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
}

export async function pagarPagamento(request, response) {
  try {
    const { id } = request.params;
    const pagamento = await pagamentosLogic.pagarPagamento(id);

    if (!pagamento) {
      return response.status(404).json({ erro: "Pagamento não encontrado" });
    }

    return response.status(200).json(pagamento);
  } catch (error) {
    console.error(`Erro ao registrar pagamento: ${error.message}`);
    if (error instanceof ErroValidacao) {
      return response.status(400).json({
        erro: error.message,
      });
    }

    if (error instanceof ErroConflito) {
      return response.status(409).json({
        erro: error.message,
      });
    }

    if (error instanceof ErroBanco) {
      return response.status(error.status).json({
        erro: error.message,
      });
    }

    return response.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
}
