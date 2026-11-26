import * as alunosRepository from "../repositories/alunosRepository.js";
import { Aluno } from "../models/aluno.js";
import { ErroBanco } from "../models/erroBanco.js";
import { ErroConflito } from "../models/erroConflito.js";
import { ErroValidacao } from "../models/erroValidacao.js";

export async function listarAlunos() {
	try {
		const alunos = await alunosRepository.listarAlunos();
		return alunos;
	} catch (error) {
		throw new Error("Não foi possível listar os alunos");
	}
}

export async function listarAlunoPorId(id) {
	try {
		const aluno = await alunosRepository.listarAlunoPorId(id);
		return aluno;
	} catch (error) {
		throw new Error("Não foi possível listar o aluno por ID");
	}
}

export async function cadastrarAluno(dados) {
	try {
		const aluno = new Aluno(dados);

		if (await alunosRepository.buscarAlunoPorEmail(aluno.email)) {
			throw new ErroConflito("Já existe um aluno cadastrado com este e-mail");
		}

		if (await alunosRepository.buscarAlunoPorCpf(aluno.cpf)) {
			throw new ErroConflito("Já existe um aluno cadastrado com este CPF");
		}

		if (!(await alunosRepository.existePlano(aluno.plano_id))) {
			throw new ErroValidacao("O plano informado em plano_id não existe");
		}

		return await alunosRepository.cadastrarAluno(aluno);
	} catch (error) {
		// Erros esperados seguem como estão para o controller.
		if (
			error instanceof ErroValidacao ||
			error instanceof ErroConflito ||
			error instanceof ErroBanco
		) {
			throw error;
		}

		console.error("Falha em cadastrarAluno:", error);
		throw new Error("Não foi possível cadastrar o aluno");
	}
}
