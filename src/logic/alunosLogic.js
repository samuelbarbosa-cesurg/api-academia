import * as alunosRepository from "../repositories/alunosRepository.js";

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
