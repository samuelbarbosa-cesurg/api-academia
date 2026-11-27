import * as pagamentosRepository from "../repositories/pagamentosRepository.js";
import { ErroBanco } from "../models/erroBanco.js";
import { ErroConflito } from "../models/erroConflito.js";
import { ErroValidacao } from "../models/erroValidacao.js";

export async function listarPagamentos() {
	try {
		const pagamentos = await pagamentosRepository.listarPagamentos();
		return pagamentos;
	} catch (error) {
		console.error("Falha em listarPagamentos:", error);
		throw new Error("Não foi possível listar os pagamentos");
	}
}

export async function pagarPagamento(id) {
	try {
		const pagamentoId = Number(id);
		if (!Number.isInteger(pagamentoId) || pagamentoId <= 0) {
			throw new ErroValidacao("Informe um ID de pagamento válido");
		}

		const pagamento = await pagamentosRepository.buscarPagamentoPorId(pagamentoId);
		if (!pagamento) {
			return null;
		}

		if (pagamento.status === "pago") {
			throw new ErroConflito("Este pagamento já está pago");
		}

		return await pagamentosRepository.pagarPagamento(pagamentoId);
	} catch (error) {
		if (error instanceof ErroValidacao || error instanceof ErroConflito || error instanceof ErroBanco) {
			throw error;
		}

		console.error("Falha em pagarPagamento:", error);
		throw new Error("Não foi possível registrar o pagamento");
	}
}
