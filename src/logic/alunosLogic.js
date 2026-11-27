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
		if (error instanceof ErroValidacao || error instanceof ErroConflito || error instanceof ErroBanco) {
			throw error;
		}

		throw new Error("Não foi possível cadastrar o aluno");
	}
}

export async function atualizarAluno(id, dados) {
	try {
		const alunoExistente = await alunosRepository.listarAlunoPorId(id);
		if (!alunoExistente) {
			throw new ErroValidacao("Aluno não encontrado");
		}

		if (typeof dados.email === "string" && dados.email && dados.email !== alunoExistente.email) {
			const emailExistente = await alunosRepository.buscarAlunoPorEmail(dados.email);
			if (emailExistente && emailExistente.id !== id) {
				throw new ErroConflito("Já existe um aluno cadastrado com este e-mail");
			}
		}

		if (typeof dados.cpf === "string" && dados.cpf && dados.cpf !== alunoExistente.cpf) {
			const cpfExistente = await alunosRepository.buscarAlunoPorCpf(dados.cpf);
			if (cpfExistente && cpfExistente.id !== id) {
				throw new ErroConflito("Já existe um aluno cadastrado com este CPF");
			}

			if(dados.cpf.length !== 11) {
				throw new ErroValidacao("O CPF deve ter 11 dígitos");
			}
		}

		if (typeof dados.nome === "string" && dados.nome.trim() === "") {
			throw new ErroValidacao("O nome não pode ser vazio");
		}

		const formatarData = (valor) => valor instanceof Date ? valor.toISOString().slice(0, 10) : valor;

		const alunoAtualizado = new Aluno({
			...alunoExistente,
			data_nascimento: formatarData(alunoExistente.data_nascimento),
			inicio_plano: formatarData(alunoExistente.inicio_plano),
		});

		if (typeof dados.nome === "string" && dados.nome) {
			alunoAtualizado.nome = dados.nome;
		}

		if (typeof dados.cpf === "string" && dados.cpf) {
			alunoAtualizado.cpf = dados.cpf;
		}

		if (typeof dados.email === "string" && dados.email) {
			alunoAtualizado.email = dados.email;
		}

		return await alunosRepository.atualizarAluno(id, alunoAtualizado);

	} catch (error) {
		if (error instanceof ErroValidacao || error instanceof ErroConflito || error instanceof ErroBanco) {
			throw error;
		}

		console.error("Falha em atualizarAluno:", error);
		throw new Error("Não foi possível atualizar o aluno");
	}
}

export async function excluirAluno(id) {
	try {
		return await alunosRepository.excluirAluno(id);
	} catch (error) {
		if (error instanceof ErroBanco) {
			throw error;
		}

		throw new Error("Não foi possível excluir o aluno");
	}
}
