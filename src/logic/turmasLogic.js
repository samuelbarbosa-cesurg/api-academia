import * as turmasRepository from "../repositories/turmasRepository.js";
import * as alunosRepository from "../repositories/alunosRepository.js";
import { Inscricao } from "../models/inscricao.js";
import { ErroBanco } from "../models/erroBanco.js";
import { ErroConflito } from "../models/erroConflito.js";
import { ErroNaoEncontrado } from "../models/erroNaoEncontrado.js";
import { ErroValidacao } from "../models/erroValidacao.js";

export async function listarTurmas() {
	try {
		const turmas = await turmasRepository.listarTurmas();
		return turmas;
	} catch (error) {
		throw new Error("Não foi possível listar as turmas");
	}
}

export async function inscreverAluno(turmaId, dados) {
	try {
		const inscricao = new Inscricao({
			turma_id: Number(turmaId),
			aluno_id: dados.alunoId,
		});

		const turma = await turmasRepository.buscarTurmaPorId(inscricao.turma_id);
		if (!turma) {
			throw new ErroNaoEncontrado("Turma não encontrada");
		}

		const aluno = await alunosRepository.listarAlunoPorId(inscricao.aluno_id);
		if (!aluno) {
			throw new ErroNaoEncontrado("Aluno não encontrado");
		}

		if (!aluno.ativo) {
			throw new ErroConflito("Aluno inativo não pode ser inscrito");
		}

		if (await turmasRepository.buscarInscricao(inscricao.turma_id, inscricao.aluno_id)) {
			throw new ErroConflito("O aluno já está inscrito nesta turma");
		}

		const inscricoes = await turmasRepository.listarInscricoesPorTurma(inscricao.turma_id);
		if (inscricoes.length >= turma.vagas) {
			throw new ErroConflito("A turma não tem vagas disponíveis");
		}

		return await turmasRepository.inscreverAluno(inscricao);
	} catch (error) {
		if (
			error instanceof ErroValidacao ||
			error instanceof ErroNaoEncontrado ||
			error instanceof ErroConflito ||
			error instanceof ErroBanco
		) {
			throw error;
		}

		console.error("Falha em inscreverAluno:", error);
		throw new Error("Não foi possível inscrever o aluno");
	}
}

export async function cancelarInscricao(turmaId, alunoId) {
	try {
		const inscricao = new Inscricao({
			turma_id: Number(turmaId),
			aluno_id: Number(alunoId),
		});

		const turma = await turmasRepository.buscarTurmaPorId(inscricao.turma_id);
		if (!turma) {
			throw new ErroNaoEncontrado("Turma não encontrada");
		}

		const aluno = await alunosRepository.listarAlunoPorId(inscricao.aluno_id);
		if (!aluno) {
			throw new ErroNaoEncontrado("Aluno não encontrado");
		}

		return await turmasRepository.cancelarInscricao(inscricao);
	} catch (error) {
		if (error instanceof ErroValidacao || error instanceof ErroNaoEncontrado || error instanceof ErroBanco) {
			throw error;
		}

		console.error("Falha em cancelarInscricao:", error);
		throw new Error("Não foi possível cancelar a inscrição");
	}
}
